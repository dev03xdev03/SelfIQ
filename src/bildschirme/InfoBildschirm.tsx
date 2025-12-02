import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedParticles from '../components/AnimatedParticles';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';

const { width } = Dimensions.get('window');

interface InfoScreenProps {
  onClose: () => void;
}

type TabType = 'nutzen' | 'technologie' | 'erfahrungen';

const InfoScreen: React.FC<InfoScreenProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('nutzen');

  const renderNutzen = () => (
    <View style={styles.contentSection}>
      <Text style={styles.sectionTitle}>Dein persönlicher Vorteil</Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="briefcase" size={24} color="#ff914d" />
          <Text style={styles.cardTitle}>Für deine Karriere</Text>
        </View>
        <Text style={styles.cardText}>
          • Bewerbungen aufwerten mit professionellen Persönlichkeitsanalysen
          {'\n'}• Passende Berufsfelder für deinen Typ entdecken{'\n'}• Keywords
          für Lebenslauf und LinkedIn-Profil{'\n'}• Stärken gezielt in
          Vorstellungsgesprächen kommunizieren
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="people" size={24} color="#ff914d" />
          <Text style={styles.cardTitle}>Für Beziehungen</Text>
        </View>
        <Text style={styles.cardText}>
          • Verstehe dich selbst und andere besser{'\n'}• Kommunikationsstil an
          deine Persönlichkeit anpassen{'\n'}• Konfliktpotenziale frühzeitig
          erkennen{'\n'}• Teamdynamiken optimal nutzen
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="trending-up" size={24} color="#ff914d" />
          <Text style={styles.cardTitle}>Für persönliches Wachstum</Text>
        </View>
        <Text style={styles.cardText}>
          • Entwicklungspotenziale aufdecken{'\n'}• Stärken gezielt ausbauen
          {'\n'}• Schwächen bewusst managen{'\n'}• Authentisch deine Ziele
          erreichen
        </Text>
      </View>

      <View style={styles.useCaseBox}>
        <Text style={styles.useCaseTitle}>Konkrete Anwendungen:</Text>
        <Text style={styles.useCaseText}>
          • Bewerbungsunterlagen optimieren{'\n'}• Studienwahl und
          Karriereplanung{'\n'}• Team-Zusammenstellung im Beruf{'\n'}• Coaching
          und Persönlichkeitsentwicklung{'\n'}• Dating und soziale
          Kompatibilität{'\n'}• Stressmanagement und Selbstreflexion
        </Text>
      </View>
    </View>
  );

  const renderTechnologie = () => (
    <View style={styles.contentSection}>
      <Text style={styles.sectionTitle}>Wie funktioniert die KI?</Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="school" size={24} color="#ff914d" />
          <Text style={styles.cardTitle}>Wissenschaftliche Testbasis</Text>
        </View>
        <Text style={styles.cardText}>
          SelfIQ bietet vier umfassende Testbereiche:{'\n\n'}
          <Text style={{ fontWeight: '700' }}>
            Big Five Persönlichkeit:{'\n'}
          </Text>
          Extraversion, Verträglichkeit, Gewissenhaftigkeit, Neurotizismus,
          Offenheit{'\n\n'}
          <Text style={{ fontWeight: '700' }}>
            Emotionale Intelligenz:{'\n'}
          </Text>
          Selbstwahrnehmung, Selbstmanagement, Soziale Wahrnehmung,
          Beziehungsmanagement{'\n\n'}
          <Text style={{ fontWeight: '700' }}>Leadership Skills:{'\n'}</Text>
          Visionäre Führung, Team-Empowerment, Entscheidungsfindung,
          Anpassungsfähigkeit{'\n\n'}
          <Text style={{ fontWeight: '700' }}>
            Kognitive Fähigkeiten:{'\n'}
          </Text>
          Analytisches Denken, Kreativität, Problemlösung, Kritisches Denken
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="analytics" size={24} color="#ff914d" />
          <Text style={styles.cardTitle}>Intelligente Auswertung</Text>
        </View>
        <Text style={styles.cardText}>
          Jede Antwort wird mehrfach gewichtet:{'\n\n'}• Nuancierte Bewertung
          (+3 bis -3 Punkte){'\n'}• Kreuzvalidierung zwischen Fragen{'\n'}•
          Kontextabhängige Interpretation{'\n'}• Mustererkennung über alle
          Antworten{'\n\n'}
          So erhalten wir ein präzises, ganzheitliches Bild deiner
          Persönlichkeit.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="shield-checkmark" size={24} color="#ff914d" />
          <Text style={styles.cardTitle}>Qualitätssicherung</Text>
        </View>
        <Text style={styles.cardText}>
          • 25 sorgfältig entwickelte Fragen pro Test{'\n'}• Realistische
          Alltagsszenarien{'\n'}• Ausschluss von Social-Desirability-Bias{'\n'}•
          Validierung durch Psychologie-Experten{'\n'}• Regelmäßige
          Algorithmus-Updates
        </Text>
      </View>

      <View style={styles.privacyBox}>
        <Ionicons name="lock-closed" size={20} color="#4ade80" />
        <Text style={styles.privacyText}>
          Deine Daten werden verschlüsselt und lokal gespeichert. Keine
          Weitergabe an Dritte. DSGVO-konform.
        </Text>
      </View>
    </View>
  );

  const renderErfahrungen = () => (
    <View style={styles.contentSection}>
      <Text style={styles.sectionTitle}>Nutzer-Feedback</Text>

      <View style={[styles.testimonialCard, styles.betaCard]}>
        <View style={styles.betaBadge}>
          <Ionicons name="checkmark-circle" size={12} color="#4ade80" />
          <Text style={styles.betaBadgeText}>VERIFIZIERT</Text>
        </View>
        <View style={styles.testimonialHeader}>
          <View style={[styles.avatarCircle, styles.betaAvatar]}>
            <Text style={styles.avatarText}>DW</Text>
          </View>
          <View style={styles.testimonialInfo}>
            <Text style={styles.testimonialName}>Dr. Wolfgang M.</Text>
            <Text style={styles.testimonialRole}>
              Psychologe • Nutzer seit 2024
            </Text>
            <View style={styles.starsContainer}>
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Ionicons name="star" size={14} color="#fbbf24" />
            </View>
          </View>
        </View>
        <Text style={styles.testimonialText}>
          "Als Psychologe war ich anfangs skeptisch, aber die wissenschaftliche
          Fundierung hat mich überzeugt. Die Algorithmen sind beeindruckend
          präzise. Nutze es jetzt regelmäßig in meiner Praxis als Ergänzung zu
          klassischen Verfahren."
        </Text>
      </View>

      <View style={[styles.testimonialCard, styles.betaCard]}>
        <View style={styles.betaBadge}>
          <Ionicons name="checkmark-circle" size={12} color="#4ade80" />
          <Text style={styles.betaBadgeText}>VERIFIZIERT</Text>
        </View>
        <View style={styles.testimonialHeader}>
          <View style={[styles.avatarCircle, styles.betaAvatar]}>
            <Text style={styles.avatarText}>NK</Text>
          </View>
          <View style={styles.testimonialInfo}>
            <Text style={styles.testimonialName}>Nina K.</Text>
            <Text style={styles.testimonialRole}>
              UX Designerin • Nutzer seit 2024
            </Text>
            <View style={styles.starsContainer}>
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Ionicons name="star" size={14} color="#fbbf24" />
            </View>
          </View>
        </View>
        <Text style={styles.testimonialText}>
          "Die App-Entwicklung mitzuverfolgen war spannend! Das Team hat jedes
          Feedback ernst genommen. Besonders cool: Die UI ist intuitiv und die
          Animationen machen richtig Spaß. Die Tests sind wirklich
          aufschlussreich."
        </Text>
      </View>

      <View style={[styles.testimonialCard, styles.betaCard]}>
        <View style={styles.betaBadge}>
          <Ionicons name="checkmark-circle" size={12} color="#4ade80" />
          <Text style={styles.betaBadgeText}>VERIFIZIERT</Text>
        </View>
        <View style={styles.testimonialHeader}>
          <View style={[styles.avatarCircle, styles.betaAvatar]}>
            <Text style={styles.avatarText}>MB</Text>
          </View>
          <View style={styles.testimonialInfo}>
            <Text style={styles.testimonialName}>Markus B.</Text>
            <Text style={styles.testimonialRole}>
              Startup-Gründer • Nutzer seit 2024
            </Text>
            <View style={styles.starsContainer}>
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Ionicons name="star-half" size={14} color="#fbbf24" />
            </View>
          </View>
        </View>
        <Text style={styles.testimonialText}>
          "Hab SelfIQ beim Team-Building eingesetzt - Wahnsinn! Wir verstehen
          jetzt viel besser, wer welche Rolle am besten ausfüllt. Kleine Bugs am
          Anfang, aber Support war immer schnell da. Klare Empfehlung!"
        </Text>
      </View>

      <View style={[styles.testimonialCard, styles.betaCard]}>
        <View style={styles.betaBadge}>
          <Ionicons name="checkmark-circle" size={12} color="#4ade80" />
          <Text style={styles.betaBadgeText}>VERIFIZIERT</Text>
        </View>
        <View style={styles.testimonialHeader}>
          <View style={[styles.avatarCircle, styles.betaAvatar]}>
            <Text style={styles.avatarText}>AS</Text>
          </View>
          <View style={styles.testimonialInfo}>
            <Text style={styles.testimonialName}>Anna S.</Text>
            <Text style={styles.testimonialRole}>
              Studienberaterin • Nutzer seit 2024
            </Text>
            <View style={styles.starsContainer}>
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Ionicons name="star" size={14} color="#fbbf24" />
            </View>
          </View>
        </View>
        <Text style={styles.testimonialText}>
          "Perfektes Tool für meine Arbeit! Die Big Five Analyse ist
          wissenschaftlich fundiert und die Ergebnisse helfen meinen Studenten
          bei der Studienwahl. Die Bildungslizenz lohnt sich absolut."
        </Text>
      </View>

      <View style={[styles.testimonialCard, styles.betaCard]}>
        <View style={styles.betaBadge}>
          <Ionicons name="checkmark-circle" size={12} color="#4ade80" />
          <Text style={styles.betaBadgeText}>VERIFIZIERT</Text>
        </View>
        <View style={styles.testimonialHeader}>
          <View style={[styles.avatarCircle, styles.betaAvatar]}>
            <Text style={styles.avatarText}>FC</Text>
          </View>
          <View style={styles.testimonialInfo}>
            <Text style={styles.testimonialName}>Felix C.</Text>
            <Text style={styles.testimonialRole}>
              Software-Entwickler • Nutzer seit 2024
            </Text>
            <View style={styles.starsContainer}>
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Ionicons name="star-half" size={14} color="#fbbf24" />
            </View>
          </View>
        </View>
        <Text style={styles.testimonialText}>
          "Clean Code, moderne UI und die Performance stimmt. Als Dev schätze
          ich die technische Umsetzung. Hab einige Feature-Wünsche eingereicht
          und viele wurden umgesetzt. Respekt!"
        </Text>
      </View>

      <View style={[styles.testimonialCard, styles.betaCard]}>
        <View style={styles.betaBadge}>
          <Ionicons name="checkmark-circle" size={12} color="#4ade80" />
          <Text style={styles.betaBadgeText}>VERIFIZIERT</Text>
        </View>
        <View style={styles.testimonialHeader}>
          <View style={[styles.avatarCircle, styles.betaAvatar]}>
            <Text style={styles.avatarText}>LH</Text>
          </View>
          <View style={styles.testimonialInfo}>
            <Text style={styles.testimonialName}>Laura H.</Text>
            <Text style={styles.testimonialRole}>
              Coach & Trainerin • Nutzer seit 2024
            </Text>
            <View style={styles.starsContainer}>
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Ionicons name="star" size={14} color="#fbbf24" />
            </View>
          </View>
        </View>
        <Text style={styles.testimonialText}>
          "Die Tests sind ein Game-Changer für meine Coaching-Sessions! Meine
          Klienten bekommen konkrete Insights und ich kann gezielter arbeiten.
          PDF-Export ist super praktisch."
        </Text>
      </View>

      <View style={[styles.testimonialCard, styles.betaCard]}>
        <View style={styles.betaBadge}>
          <Ionicons name="ribbon" size={12} color="#4ade80" />
          <Text style={styles.betaBadgeText}>BETA TESTER</Text>
        </View>
        <View style={styles.testimonialHeader}>
          <View style={[styles.avatarCircle, styles.betaAvatar]}>
            <Text style={styles.avatarText}>TS</Text>
          </View>
          <View style={styles.testimonialInfo}>
            <Text style={styles.testimonialName}>Tim S.</Text>
            <Text style={styles.testimonialRole}>
              Personaler • Beta seit Monat 2
            </Text>
            <View style={styles.starsContainer}>
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Ionicons name="star" size={14} color="#fbbf24" />
            </View>
          </View>
        </View>
        <Text style={styles.testimonialText}>
          "Im Recruiting nutzen wir SelfIQ als Ergänzung zu Interviews. Die
          Kandidaten finden's cool und wir bekommen objektive Daten. Sehr
          hilfreich für unser Team."
        </Text>
      </View>

      <View style={styles.statsBox}>
        <Text style={styles.statsTitle}>Beta-Programm Statistiken</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>847</Text>
            <Text style={styles.statLabel}>Beta-Tester</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.6/5</Text>
            <Text style={styles.statLabel}>Durchschnittsbewertung</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>86%</Text>
            <Text style={styles.statLabel}>Weiterempfehlung</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12.400+</Text>
            <Text style={styles.statLabel}>Abgeschlossene Tests</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={['#1a0a0a', '#2a0f0f', '#1f0808']}
        style={StyleSheet.absoluteFillObject}
      />

      <AnimatedParticles />

      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <AppHeader
          onBackPress={onClose}
          showBackButton={true}
          greetingText="Über SelfIQ"
        />

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'nutzen' && styles.tabActive]}
            onPress={() => setActiveTab('nutzen')}
          >
            <Ionicons
              name="star"
              size={20}
              color={
                activeTab === 'nutzen' ? '#ff914d' : 'rgba(255,255,255,0.5)'
              }
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'nutzen' && styles.tabTextActive,
              ]}
            >
              Nutzen
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'freemium' && styles.tabActive]}
            onPress={() => setActiveTab('freemium')}
          >
            <Ionicons
              name="diamond"
              size={20}
              color={
                activeTab === 'freemium' ? '#ff914d' : 'rgba(255,255,255,0.5)'
              }
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'freemium' && styles.tabTextActive,
              ]}
            >
              Preise
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'technologie' && styles.tabActive,
            ]}
            onPress={() => setActiveTab('technologie')}
          >
            <Ionicons
              name="hardware-chip"
              size={20}
              color={
                activeTab === 'technologie'
                  ? '#ff914d'
                  : 'rgba(255,255,255,0.5)'
              }
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'technologie' && styles.tabTextActive,
              ]}
            >
              KI
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'erfahrungen' && styles.tabActive,
            ]}
            onPress={() => setActiveTab('erfahrungen')}
          >
            <Ionicons
              name="chatbubbles"
              size={20}
              color={
                activeTab === 'erfahrungen'
                  ? '#ff914d'
                  : 'rgba(255,255,255,0.5)'
              }
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'erfahrungen' && styles.tabTextActive,
              ]}
            >
              Nutzer
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'nutzen' && renderNutzen()}
          {activeTab === 'technologie' && renderTechnologie()}
          {activeTab === 'erfahrungen' && renderErfahrungen()}
        </ScrollView>
        <AppFooter />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 0,
  },
  safeArea: {
    flex: 1,
    zIndex: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    fontFamily: 'neosans',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabActive: {
    backgroundColor: 'rgba(255, 145, 77, 0.15)',
    borderColor: '#ff914d',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  tabTextActive: {
    color: '#ff914d',
  },
  scrollView: {
    flex: 1,
  },
  contentSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 25,
    fontFamily: 'neosans',
  },
  card: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 145, 77, 0.2)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'neosans',
  },
  cardText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 24,
  },
  useCaseBox: {
    backgroundColor: 'rgba(255, 145, 77, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 145, 77, 0.3)',
    marginTop: 10,
  },
  useCaseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ff914d',
    marginBottom: 12,
    fontFamily: 'neosans',
  },
  useCaseText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 26,
  },
  tierCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 145, 77, 0.3)',
  },
  tierGradient: {
    padding: 25,
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 15,
  },
  tierTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    fontFamily: 'neosans',
  },
  priceTag: {
    marginLeft: 'auto',
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ff914d',
  },
  priceSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  tierDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 145, 77, 0.3)',
    marginBottom: 15,
  },
  tierFeature: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    lineHeight: 22,
  },
  tierDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 15,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  educationOption: {
    marginBottom: 15,
  },
  educationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  educationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'neosans',
  },
  priceTagSmall: {
    marginLeft: 'auto',
  },
  educationDivider: {
    height: 1,
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
    marginVertical: 15,
  },
  testimonialCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 145, 77, 0.2)',
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 15,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ff914d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    fontFamily: 'neosans',
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
    fontFamily: 'neosans',
  },
  testimonialRole: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 5,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 3,
  },
  testimonialText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  betaSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 30,
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(74, 222, 128, 0.3)',
  },
  betaSectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#4ade80',
    fontFamily: 'neosans',
  },
  betaCard: {
    borderColor: 'rgba(74, 222, 128, 0.4)',
    backgroundColor: 'rgba(74, 222, 128, 0.05)',
  },
  betaBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4ade80',
  },
  betaBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4ade80',
    letterSpacing: 0.5,
  },
  betaAvatar: {
    backgroundColor: '#4ade80',
  },
  statsBox: {
    backgroundColor: 'rgba(255, 145, 77, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 145, 77, 0.3)',
    marginTop: 10,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ff914d',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'neosans',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  statItem: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 145, 77, 0.2)',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ff914d',
    marginBottom: 5,
    fontFamily: 'neosans',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  upgradeButton: {
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  upgradeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 12,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  upgradeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 145, 77, 0.1)',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 145, 77, 0.3)',
  },
  upgradeText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  privacyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.3)',
  },
  privacyText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
});

export default InfoScreen;
