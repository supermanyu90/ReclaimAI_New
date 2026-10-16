import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { auth, googleProvider } from './lib/firebase';
import {
  subscribeUserAssets,
  createFirestoreAsset,
  syncUserProfile,
  seedDemoAssetsToFirestore,
} from './lib/firestoreService';
import {
  AssetItem,
  GraphEdge,
  GraphNode,
  HandoverCase,
  JapacLanguage,
  UserPersona,
} from './types';
import {
  INITIAL_ASSETS,
  INITIAL_GRAPH_EDGES,
  INITIAL_GRAPH_NODES,
  INITIAL_HANDOVER_CASE,
  JAPAC_PERSONAS,
  SAMPLE_DOCUMENTS,
} from './data/demoData';
import { Header } from './components/Header';
import { WorkspaceView } from './components/WorkspaceView';
import { LegacyChat } from './components/LegacyChat';
import { PassportView } from './components/PassportView';
import { FamilyView } from './components/FamilyView';
import { ReviewerView } from './components/ReviewerView';
import { ClaimsView } from './components/ClaimsView';
import { RecoveryView } from './components/RecoveryView';
import { AnalyticsView } from './components/AnalyticsView';
import { DigitalAssetQrView } from './components/DigitalAssetQrView';
import { HeroSection } from './components/HeroSection';
import { VoiceConciergeView } from './components/VoiceConciergeView';
import { AuthDemoGateway } from './components/AuthDemoGateway';
import { StarBackground } from './components/StarBackground';
import { translations } from './i18n/translations';
import { triggerConfetti } from './utils/formatters';

export default function App() {
  const [currentLang, setCurrentLang] = useState<JapacLanguage>('en');
  const [activePersona, setActivePersona] = useState<UserPersona>(JAPAC_PERSONAS[0]);
  const [activeTab, setActiveTab] = useState<string>('overview');

  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [handoverCase, setHandoverCase] = useState<HandoverCase>(INITIAL_HANDOVER_CASE);
  const [passportVersion, setPassportVersion] = useState<number>(1);

  // Firebase Auth and Cloud Sync state
  const [user, setUser] = useState<User | null>(null);
  const [cloudSynced, setCloudSynced] = useState<boolean>(false);
  const [appMode, setAppMode] = useState<'gateway' | 'demo' | 'auth'>('gateway');
  const [authError, setAuthError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (appMode === 'demo') {
      setAssets(INITIAL_ASSETS);
      setNodes(INITIAL_GRAPH_NODES);
      setEdges(INITIAL_GRAPH_EDGES);
    }
  }, [appMode]);

  useEffect(() => {
    let unsubscribeAssets: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setCloudSynced(true);
        setAppMode('auth');
        setAuthError(null);
        await syncUserProfile(currentUser);

        unsubscribeAssets = subscribeUserAssets(
          currentUser.uid,
          (firestoreAssets) => {
            if (firestoreAssets && firestoreAssets.length > 0) {
              setAssets(firestoreAssets);
            }
          },
          (err) => {
            console.error('Firestore subscription error:', err);
          }
        );
      } else {
        if (unsubscribeAssets) {
          unsubscribeAssets();
          unsubscribeAssets = null;
        }
        setCloudSynced(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeAssets) {
        unsubscribeAssets();
      }
    };
  }, []);

  const handleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in popup was closed before completing. Click Sign In again when ready.');
      } else if (err.code === 'auth/popup-blocked') {
        setAuthError('Sign-in popup was blocked by browser. Please allow popups for authentication.');
      } else {
        setAuthError(err.message || 'Authentication error occurred.');
      }
      console.warn('Google Sign-In Handled:', err.code || err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setCloudSynced(false);
      setAssets(INITIAL_ASSETS);
    } catch (err: any) {
      console.error('Sign-Out Error:', err);
    }
  };

  const handleSyncDemoToCloud = async () => {
    if (!user) return;
    try {
      await seedDemoAssetsToFirestore(user.uid, assets);
      triggerConfetti();
    } catch (err) {
      console.error('Failed to sync demo assets to cloud:', err);
    }
  };

  const t = translations[currentLang] || translations.en;
  const isReleased = handoverCase.status === 'released';

  // Persona auto-route convenience
  const handleSelectPersona = (persona: UserPersona) => {
    setActivePersona(persona);
    if (persona.role === 'reviewer' && activeTab !== 'reviews') {
      setActiveTab('reviews');
    } else if (persona.role === 'family' && activeTab !== 'family') {
      setActiveTab('family');
    } else if (persona.role === 'owner' && (activeTab === 'reviews' || activeTab === 'family')) {
      setActiveTab('workspace');
    }
  };

  // Add new asset from chat, voice, or OCR
  const handleCommitAsset = async (newAsset: AssetItem) => {
    if (user) {
      try {
        await createFirestoreAsset(newAsset, user.uid);
      } catch (err) {
        console.error('Firestore write error:', err);
      }
    }

    setAssets((prev) => [newAsset, ...prev]);
    setPassportVersion((prev) => prev + 1);

    // Add to knowledge graph
    const newNode: GraphNode = {
      id: newAsset.id,
      kind: 'asset',
      label: newAsset.label,
      subtitle: newAsset.institutionName,
    };

    const newEdgeOwner: GraphEdge = {
      from: 'owner_ramesh',
      to: newAsset.id,
      kind: 'holds',
    };

    const newEdgeInst: GraphEdge = {
      from: newAsset.id,
      to: 'inst_sagar',
      kind: 'custodian',
    };

    setNodes((prev) => [...prev, newNode]);
    setEdges((prev) => [...prev, newEdgeOwner, newEdgeInst]);
  };

  // Family member initiates handover request
  const handleRequestHandover = (docType: 'clean' | 'mismatch') => {
    const isMismatch = docType === 'mismatch';
    const docData = isMismatch
      ? SAMPLE_DOCUMENTS.deathCertMismatch
      : SAMPLE_DOCUMENTS.deathCertClean;

    setHandoverCase((prev) => ({
      ...prev,
      status: 'under_review',
      submittedAt: new Date().toISOString(),
      documentAttached: {
        id: `doc-${Date.now()}`,
        title: docData.fileName,
        extractedName: docData.mismatchName,
        targetName: docData.expectedName,
        hasMismatch: isMismatch,
        hash: isMismatch ? '0x8b32...d51' : '0x1c44...a90',
      },
      approvalsReceived: [],
      reviewLogs: [
        {
          id: `log-${Date.now()}`,
          reviewerId: 'system',
          reviewerName: 'System Ingestion Agent',
          decision: 'resume',
          notes: `Uploaded evidence certificate: ${docData.fileName}. Entity extraction completed.`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
    }));

    // Auto switch tab to reviews to let user experience the 2-reviewer inspection
    setActiveTab('reviews');
  };

  // Reviewer approves
  const handleReviewerApprove = (reviewerId: string, reviewerName: string) => {
    setHandoverCase((prev) => {
      const alreadyIn = prev.approvalsReceived.includes(reviewerId);
      const newApprovals = alreadyIn ? prev.approvalsReceived : [...prev.approvalsReceived, reviewerId];
      const released = newApprovals.length >= prev.requiredApprovals;

      return {
        ...prev,
        approvalsReceived: newApprovals,
        status: released ? 'released' : 'approved_partial',
        releasedAt: released ? new Date().toISOString() : null,
        reviewLogs: [
          ...prev.reviewLogs,
          {
            id: `log-${Date.now()}`,
            reviewerId,
            reviewerName,
            decision: 'approve',
            notes: `Approved release on verified documentation. Sign-off ${newApprovals.length} of ${prev.requiredApprovals}.`,
            timestamp: new Date().toLocaleTimeString(),
          },
        ],
      };
    });

    setPassportVersion((v) => v + 1);
  };

  // Reviewer places on hold
  const handleReviewerHold = (reason: string) => {
    setHandoverCase((prev) => ({
      ...prev,
      status: 'held',
      holdReason: reason,
      reviewLogs: [
        ...prev.reviewLogs,
        {
          id: `log-${Date.now()}`,
          reviewerId: activePersona.id,
          reviewerName: activePersona.name,
          decision: 'hold',
          notes: reason,
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
    }));
  };

  // Reviewer resumes
  const handleReviewerResume = () => {
    setHandoverCase((prev) => ({
      ...prev,
      status: 'under_review',
      holdReason: undefined,
      reviewLogs: [
        ...prev.reviewLogs,
        {
          id: `log-${Date.now()}`,
          reviewerId: activePersona.id,
          reviewerName: activePersona.name,
          decision: 'resume',
          notes: 'Clarification received; review reopened.',
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
    }));
  };

  // Reset demo
  const handleResetDemo = () => {
    setAssets(INITIAL_ASSETS);
    setNodes(INITIAL_GRAPH_NODES);
    setEdges(INITIAL_GRAPH_EDGES);
    setHandoverCase(INITIAL_HANDOVER_CASE);
    setPassportVersion(1);
    setActivePersona(JAPAC_PERSONAS[0]);
    setActiveTab('overview');
  };

  return (
    <div className="min-h-screen bg-[#111113] text-[#F8F7F4] font-sans selection:bg-[#87a9ff] selection:text-[#111113] flex flex-col relative">
      <StarBackground />
      {appMode === 'gateway' && !user && (
        <AuthDemoGateway
          currentLang={currentLang}
          onSelectMode={(mode) => setAppMode(mode)}
          onSignIn={handleSignIn}
          authError={authError}
        />
      )}

      {/* Top Header & Navigation */}
      <Header
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        activePersona={activePersona}
        personas={JAPAC_PERSONAS}
        onSelectPersona={handleSelectPersona}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onResetDemo={handleResetDemo}
        user={user}
        onSignIn={handleSignIn}
        onSignOut={() => {
          handleSignOut();
          setAppMode('gateway');
        }}
        isCloudSynced={cloudSynced}
        onSyncDemoToCloud={handleSyncDemoToCloud}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        appMode={appMode}
        onExitDemo={() => setAppMode('gateway')}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full mx-auto">
        {activeTab === 'overview' && (
          <div className="space-y-12">
            <HeroSection
              currentLang={currentLang}
              onGetStarted={() => setActiveTab('workspace')}
              onExplorePassport={() => setActiveTab('passport')}
              onExploreQr={() => setActiveTab('qrvault')}
              onOpenVoice={() => setActiveTab('voice')}
            />

            {/* 3 Pillars Architectural Section */}
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-16 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#1a1a1a]/15 pb-4 gap-2">
                <div>
                  <span className="font-mono-meta text-[10px] uppercase tracking-widest text-[#1a1a1a]/50">
                    Product Architecture
                  </span>
                  <h2 className="font-serif-display text-3xl font-semibold italic text-[#1a1a1a] tracking-tight">
                    The Three Disciplines of Estate Continuity
                  </h2>
                </div>
                <span className="font-mono-meta text-xs text-[#1a1a1a]/60">
                  Zero Trust • Client-Side Cryptography
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono-meta text-xs">
                {/* Pillar 1: Prepare */}
                <div className="bg-white border border-[#1a1a1a]/15 rounded-xs p-6 space-y-3 shadow-xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/50 block">
                      Phase I
                    </span>
                    <h3 className="font-serif-display text-2xl font-bold text-[#1a1a1a]">
                      Prepare &amp; Document
                    </h3>
                    <p className="font-sans text-xs text-[#1a1a1a]/75 leading-relaxed">
                      Owners describe assets conversationally or upload deposit advice. Every record links to source dates, physical coordinates, and tamper-evident QR seals.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('workspace')}
                    className="pt-4 text-xs font-bold text-[#1a1a1a] underline hover:opacity-75 cursor-pointer flex items-center justify-between"
                  >
                    <span>Open Portfolio Ledger</span>
                    <span>→</span>
                  </button>
                </div>

                {/* Pillar 2: Handover */}
                <div className="bg-white border border-[#1a1a1a]/15 rounded-xs p-6 space-y-3 shadow-xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/50 block">
                      Phase II
                    </span>
                    <h3 className="font-serif-display text-2xl font-bold text-[#1a1a1a]">
                      Governed Handover
                    </h3>
                    <p className="font-sans text-xs text-[#1a1a1a]/75 leading-relaxed">
                      Two independent compliance reviewers examine death and incapacity evidence before sensitive valuations are disclosed. Discrepancies trigger an automated audit hold.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="pt-4 text-xs font-bold text-[#1a1a1a] underline hover:opacity-75 cursor-pointer flex items-center justify-between"
                  >
                    <span>Test Dual-Key Console</span>
                    <span>→</span>
                  </button>
                </div>

                {/* Pillar 3: Recover */}
                <div className="bg-white border border-[#1a1a1a]/15 rounded-xs p-6 space-y-3 shadow-xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/50 block">
                      Phase III
                    </span>
                    <h3 className="font-serif-display text-2xl font-bold text-[#1a1a1a]">
                      Recover &amp; Claim
                    </h3>
                    <p className="font-sans text-xs text-[#1a1a1a]/75 leading-relaxed">
                      Algorithmic matching across central unclaimed deposit registries (RBI UDGAM, MAS, DICJ) coupled with jurisdiction-grounded banking claim checklists.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('claims')}
                    className="pt-4 text-xs font-bold text-[#1a1a1a] underline hover:opacity-75 cursor-pointer flex items-center justify-between"
                  >
                    <span>View Institutional Claims</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'workspace' && (
          <WorkspaceView
            currentLang={currentLang}
            assets={assets}
            nodes={nodes}
            edges={edges}
            onOpenChat={() => setActiveTab('chat')}
            onOpenPassport={() => setActiveTab('passport')}
            onOpenQr={() => setActiveTab('qrvault')}
            onOpenVoice={() => setActiveTab('voice')}
            handoverReleased={isReleased}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'voice' && (
          <VoiceConciergeView
            currentLang={currentLang}
            onRecordAsset={handleCommitAsset}
            existingAssets={assets}
            ownerName={user?.displayName || activePersona.name}
            isCloudSynced={cloudSynced}
          />
        )}

        {activeTab === 'chat' && (
          <LegacyChat
            currentLang={currentLang}
            onCommitAsset={handleCommitAsset}
            existingAssetsCount={assets.length}
          />
        )}

        {activeTab === 'passport' && (
          <PassportView
            currentLang={currentLang}
            assets={assets}
            handoverReleased={isReleased}
            passportVersion={passportVersion}
            ownerName={activePersona.name}
          />
        )}

        {activeTab === 'qrvault' && (
          <DigitalAssetQrView
            currentLang={currentLang}
            assets={assets}
            ownerName={activePersona.name}
          />
        )}

        {activeTab === 'family' && (
          <FamilyView
            currentLang={currentLang}
            handoverCase={handoverCase}
            assets={assets}
            onRequestHandover={handleRequestHandover}
            onOpenClaims={() => setActiveTab('claims')}
            onOpenPassport={() => setActiveTab('passport')}
          />
        )}

        {activeTab === 'reviews' && (
          <ReviewerView
            currentLang={currentLang}
            activePersona={activePersona}
            handoverCase={handoverCase}
            onApprove={handleReviewerApprove}
            onHold={handleReviewerHold}
            onResume={handleReviewerResume}
          />
        )}

        {activeTab === 'claims' && <ClaimsView currentLang={currentLang} />}

        {activeTab === 'recovery' && <RecoveryView currentLang={currentLang} />}

        {activeTab === 'analytics' && (
          <AnalyticsView currentLang={currentLang} assets={assets} />
        )}
        </div>
      </main>

      {/* Footer Banner */}
      <footer className="mt-auto border-t border-[#1a1a1a] bg-[#1a1a1a] text-[#f8f7f4] font-mono-meta text-[10px] tracking-wider uppercase py-4 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="font-semibold tracking-widest">
            PREPARE → HANDOVER → RECOVER
          </div>
          <div className="opacity-70">
            GROUNDED GEMINI &amp; DOCUMENT AI / MULTI-SIG GOVERNANCE
          </div>
          <div className="opacity-90">
            © RECLAIMAI • JAPAC ENTERPRISE
          </div>
        </div>
      </footer>
    </div>
  );
}
