import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';

interface DatenschutzBildschirmProps {
  onClose: () => void;
}

const DatenschutzBildschirm: React.FC<DatenschutzBildschirmProps> = ({
  onClose,
}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a0a0a', '#2a0f0f', '#1f0808']}
        style={StyleSheet.absoluteFillObject}
      />

      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <AppHeader
          onBackPress={onClose}
          showBackButton={true}
          greetingText="Datenschutzerklärung"
        />

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.lastUpdated}>Stand: Dezember 2025</Text>

            <Text style={styles.sectionTitle}>1. Verantwortlicher</Text>
            <Text style={styles.paragraph}>
              Verantwortlich für die Datenverarbeitung im Sinne der
              Datenschutz-Grundverordnung (DSGVO) ist:{'\n\n'}
              <Text style={styles.bold}>Andre Andorfer{'\n'}</Text>
              Mozartstr. 11{'\n'}
              94060 Pocking{'\n'}
              Deutschland{'\n\n'}
              E-Mail: developers@x-verse.de
            </Text>

            <Text style={styles.sectionTitle}>
              2. Umfang der Datenverarbeitung
            </Text>
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>2.1 Gast-Modus:{'\n\n'}</Text>•
              Geräte-ID (anonyme Kennung Ihres Smartphones){'\n'}• Selbst
              gewählter Gastname (keine echten Namen erforderlich)
              {'\n'}• Geschlecht (w/m/d) - automatisch erkannt anhand des Namens
              {'\n'}• Erstellungszeitpunkt des Gast-Accounts{'\n'}•
              Durchgeführte Tests und deren Ergebnisse{'\n'}• Letzte Aktivität
              (für 72h-Zeitbegrenzung){'\n\n'}
              Diese Daten werden ausschließlich lokal auf Ihrem Gerät und in
              unserer Datenbank gespeichert, aber NICHT mit Ihrer Person
              verknüpft.{'\n\n'}
              <Text style={styles.bold}>2.2 Apple Sign-In:{'\n\n'}</Text>•
              Apple-ID (verschlüsselt){'\n'}• Von Apple bereitgestellte E-Mail
              (optional anonymisiert)
              {'\n'}• Nutzername{'\n'}• Geschlecht (w/m/d) - automatisch erkannt
              {'\n'}• Geräte-ID für Synchronisation{'\n'}• Alle Testergebnisse
              und Fortschritte{'\n'}• Account-Erstellungsdatum und letzte
              Aktivität{'\n\n'}
              <Text style={styles.bold}>2.3 Technische Daten:{'\n\n'}</Text>•
              Gerätetyp und Betriebssystem-Version{'\n'}• App-Version{'\n'}•
              Fehlerprotokolle (Crash-Reports){'\n'}• Nutzungsstatistiken
              (anonymisiert)
            </Text>

            <Text style={styles.sectionTitle}>
              3. Rechtsgrundlagen der Verarbeitung
            </Text>
            <Text style={styles.paragraph}>
              Die Verarbeitung Ihrer Daten erfolgt auf Grundlage von:{'\n\n'}•
              Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) - zur
              Bereitstellung der App-Funktionen{'\n'}• Art. 6 Abs. 1 lit. f
              DSGVO (berechtigte Interessen) - zur Verbesserung der App und
              Fehleranalyse{'\n'}• Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) -
              für optionale Funktionen wie Analytics
            </Text>

            <Text style={styles.sectionTitle}>
              4. Zweck der Datenverarbeitung
            </Text>
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>
                4.1 Bereitstellung der Kernfunktionen:{'\n\n'}
              </Text>
              • Speicherung und Auswertung Ihrer Testergebnisse{'\n'}•
              KI-gestützte Persönlichkeitsanalyse{'\n'}• Fortschrittsverfolgung
              über mehrere Tests{'\n'}• Synchronisation zwischen Geräten (nur
              Apple-Nutzer){'\n\n'}
              <Text style={styles.bold}>4.2 72h-Gast-Limitierung:{'\n\n'}</Text>
              • Geräte-ID und Account-Erstellung werden gespeichert, um
              sicherzustellen, dass pro Gerät nur ein Gast-Account für 72
              Stunden genutzt werden kann{'\n'}• Nach Ablauf wird der
              Test-Zugriff gesperrt{'\n'}• Diese Maßnahme dient der
              Missbrauchsprävention{'\n\n'}
              <Text style={styles.bold}>
                4.3 Technische Optimierung:{'\n\n'}
              </Text>
              • Analyse von Fehlerprotokollen zur Behebung von Bugs{'\n'}•
              Anonymisierte Nutzungsstatistiken für App-Verbesserungen
              {'\n'}• Performance-Monitoring
            </Text>

            <Text style={styles.sectionTitle}>5. Datenspeicherung</Text>
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>
                5.1 Supabase (Cloud-Datenbank):{'\n\n'}
              </Text>
              • Sicherer Cloud-Dienst mit EU-Servern{'\n'}•
              Ende-zu-Ende-Verschlüsselung (TLS 1.3){'\n'}• ISO 27001
              zertifiziert{'\n'}• DSGVO-konform{'\n\n'}
              <Text style={styles.bold}>5.2 Lokale Speicherung:{'\n\n'}</Text>•
              Gast-Daten werden zusätzlich auf dem Gerät gespeichert{'\n'}•
              Verschlüsselung durch iOS/Android-Betriebssystem{'\n'}• Keine
              Weitergabe an Dritte
            </Text>

            <Text style={styles.sectionTitle}>6. Weitergabe von Daten</Text>
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>
                6.1 Keine Weitergabe an Dritte:{'\n\n'}
              </Text>
              Wir verkaufen, vermieten oder geben Ihre personenbezogenen Daten
              NICHT an Dritte weiter.{'\n\n'}
              <Text style={styles.bold}>6.2 Dienstleister:{'\n\n'}</Text>
              Folgende technische Dienstleister haben Zugriff auf Daten
              (ausschließlich zur Vertragserfüllung):{'\n\n'}• Supabase
              (Cloud-Datenbank, USA mit EU-Privacy-Shield){'\n'}• Apple (Apple
              Sign-In, USA mit strengen Datenschutzrichtlinien)
              {'\n'}• Expo (App-Framework, USA - nur anonymisierte
              Crash-Reports)
              {'\n\n'}
              Alle Dienstleister sind DSGVO-konform und haben
              Auftragsverarbeitungsverträge (AVV) abgeschlossen.{'\n\n'}
              <Text style={styles.bold}>
                6.3 Gesetzliche Verpflichtungen:{'\n\n'}
              </Text>
              In Ausnahmefällen können wir Daten offenlegen, wenn:{'\n'}•
              Gerichtliche Anordnungen vorliegen{'\n'}• Strafverfolgungsbehörden
              Zugriff verlangen{'\n'}• Gefahr für Leben oder Gesundheit besteht
            </Text>

            <Text style={styles.sectionTitle}>7. Speicherdauer</Text>
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>Gast-Accounts:{'\n'}</Text>• 72 Stunden
              aktive Nutzung{'\n'}• Nach Ablauf: Account wird gesperrt, aber
              Daten bleiben 30 Tage gespeichert für evtl. Migration zu
              Apple-Account{'\n'}• Nach 30 Tagen: Automatische Löschung aller
              Gast-Daten{'\n\n'}
              <Text style={styles.bold}>Apple-Accounts:{'\n'}</Text>•
              Unbegrenzte Speicherung während aktiver Nutzung{'\n'}• Bei
              Account-Löschung: Sofortige Entfernung aller Daten{'\n'}• Inaktive
              Accounts (&gt;2 Jahre): Löscherinnerung per E-Mail
              {'\n\n'}
              <Text style={styles.bold}>Crash-Reports:{'\n'}</Text>• 90 Tage
              Aufbewahrung zur Fehleranalyse{'\n'}• Komplett anonymisiert
            </Text>

            <Text style={styles.sectionTitle}>8. Datensicherheit</Text>
            <Text style={styles.paragraph}>
              Wir setzen umfassende Sicherheitsmaßnahmen ein:{'\n\n'}• TLS 1.3
              Verschlüsselung für alle Datenübertragungen{'\n'}• AES-256
              Verschlüsselung für gespeicherte Daten{'\n'}•
              Zwei-Faktor-Authentifizierung für Admin-Zugriffe{'\n'}•
              Regelmäßige Sicherheitsaudits{'\n'}• Automatische Backups
              (verschlüsselt){'\n'}• Strikte Zugriffskontrollen{'\n'}• Kein
              Zugriff von Mitarbeitern auf Testergebnisse
            </Text>

            <Text style={styles.sectionTitle}>9. Ihre Rechte (DSGVO)</Text>
            <Text style={styles.paragraph}>
              Sie haben folgende Rechte:{'\n\n'}
              <Text style={styles.bold}>
                1. Recht auf Auskunft (Art. 15 DSGVO):{'\n'}
              </Text>
              Sie können jederzeit Auskunft über die von uns gespeicherten Daten
              verlangen.{'\n\n'}
              <Text style={styles.bold}>
                2. Recht auf Berichtigung (Art. 16 DSGVO):{'\n'}
              </Text>
              Unrichtige Daten können Sie jederzeit in der App ändern oder uns
              kontaktieren.{'\n\n'}
              <Text style={styles.bold}>
                3. Recht auf Löschung (Art. 17 DSGVO):{'\n'}
              </Text>
              Sie können Ihren Account jederzeit in der App löschen. Alle Daten
              werden innerhalb von 48 Stunden unwiderruflich entfernt.{'\n\n'}
              <Text style={styles.bold}>
                4. Recht auf Einschränkung (Art. 18 DSGVO):{'\n'}
              </Text>
              Sie können die Verarbeitung Ihrer Daten einschränken lassen.
              {'\n\n'}
              <Text style={styles.bold}>
                5. Recht auf Datenübertragbarkeit (Art. 20 DSGVO):{'\n'}
              </Text>
              Sie können Ihre Daten in einem maschinenlesbaren Format (JSON)
              exportieren.{'\n\n'}
              <Text style={styles.bold}>
                6. Widerspruchsrecht (Art. 21 DSGVO):{'\n'}
              </Text>
              Sie können der Verarbeitung Ihrer Daten jederzeit widersprechen.
              {'\n\n'}
              <Text style={styles.bold}>7. Beschwerderecht:{'\n'}</Text>
              Bei Datenschutzverstößen können Sie sich an die zuständige
              Aufsichtsbehörde wenden:{'\n\n'}
              Bayerisches Landesamt für Datenschutzaufsicht{'\n'}
              Promenade 18{'\n'}
              91522 Ansbach{'\n'}
              poststelle@lda.bayern.de
            </Text>

            <Text style={styles.sectionTitle}>
              10. Apple Sign-In Datenschutz
            </Text>
            <Text style={styles.paragraph}>
              Bei Nutzung von "Mit Apple anmelden":{'\n\n'}• Apple übermittelt
              eine verschlüsselte Nutzer-ID an uns{'\n'}• Sie können wählen, ob
              Ihre echte E-Mail oder eine Apple-Relay-E-Mail verwendet wird
              {'\n'}• Wir erhalten KEINEN Zugriff auf Ihre Apple-ID oder
              Passwort
              {'\n'}• Apple's Datenschutzrichtlinien gelten zusätzlich:{' '}
              https://www.apple.com/legal/privacy/
            </Text>

            <Text style={styles.sectionTitle}>11. Cookies und Tracking</Text>
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>KEINE Cookies:{'\n\n'}</Text>
              Unsere App verwendet KEINE Cookies, da es sich um eine native
              mobile Anwendung handelt.{'\n\n'}
              <Text style={styles.bold}>Anonymisierte Analytics:{'\n\n'}</Text>
              Wir nutzen Expo Analytics (optional, kann deaktiviert werden) für:
              {'\n'}• Absturzberichte{'\n'}• Anonymisierte Nutzungsstatistiken
              {'\n'}• Performance-Metriken{'\n\n'}
              Diese Daten sind NICHT personenbezogen und können keiner Person
              zugeordnet werden.
            </Text>

            <Text style={styles.sectionTitle}>12. Minderjährigenschutz</Text>
            <Text style={styles.paragraph}>
              Unsere App richtet sich an Nutzer ab 16 Jahren gemäß DSGVO.
              {'\n\n'}
              Nutzer unter 16 Jahren benötigen die Zustimmung eines
              Erziehungsberechtigten. Wir erheben wissentlich KEINE Daten von
              Kindern ohne elterliche Einwilligung.{'\n\n'}
              Sollten wir feststellen, dass ein Kind unter 16 Jahren Daten ohne
              Zustimmung übermittelt hat, werden diese unverzüglich gelöscht.
            </Text>

            <Text style={styles.sectionTitle}>
              13. Datenübermittlung in Drittländer
            </Text>
            <Text style={styles.paragraph}>
              Einige unserer Dienstleister (Supabase, Apple, Expo) haben Server
              in den USA. Die Datenübermittlung erfolgt auf Basis von:{'\n\n'}•
              EU-Standardvertragsklauseln (SCCs){'\n'}•
              Angemessenheitsbeschlüssen der EU-Kommission{'\n'}• Zusätzlichen
              technischen und organisatorischen Maßnahmen zum Schutz Ihrer Daten
            </Text>

            <Text style={styles.sectionTitle}>
              14. Automatisierte Entscheidungsfindung
            </Text>
            <Text style={styles.paragraph}>
              Die KI-gestützte Auswertung der Tests erfolgt AUSSCHLIESSLICH zu
              Informationszwecken. Es werden KEINE automatisierten
              Entscheidungen getroffen, die rechtliche Wirkung entfalten oder
              Sie erheblich beeinträchtigen.{'\n\n'}
              Die Testergebnisse dienen der Selbstreflexion und ersetzen KEINE
              professionelle psychologische Beratung.
            </Text>

            <Text style={styles.sectionTitle}>
              15. Änderungen der Datenschutzerklärung
            </Text>
            <Text style={styles.paragraph}>
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um
              aktuellen rechtlichen Anforderungen zu entsprechen oder Änderungen
              an der App umzusetzen.{'\n\n'}
              Bei wesentlichen Änderungen werden Sie über eine
              In-App-Benachrichtigung informiert. Die aktuelle Version ist immer
              in der App einsehbar.
            </Text>

            <Text style={styles.sectionTitle}>16. Kontakt</Text>
            <Text style={styles.paragraph}>
              Bei Fragen zum Datenschutz, zur Ausübung Ihrer Rechte oder
              Beschwerden kontaktieren Sie uns:{'\n\n'}
              <Text style={styles.bold}>Andre Andorfer{'\n'}</Text>
              Mozartstr. 11{'\n'}
              94060 Pocking{'\n'}
              Deutschland{'\n\n'}
              E-Mail: developers@x-verse.de{'\n'}
              (Reaktionszeit: innerhalb von 48 Stunden){'\n\n'}
              Wir nehmen Datenschutz sehr ernst und werden Ihr Anliegen
              schnellstmöglich bearbeiten.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    fontFamily: 'neosans',
  },
  placeholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#ff914d',
    marginBottom: 30,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ff3131',
    marginTop: 25,
    marginBottom: 15,
    fontFamily: 'neosans',
  },
  paragraph: {
    fontSize: 15,
    color: '#e0e0e0',
    lineHeight: 24,
    marginBottom: 15,
  },
  bold: {
    fontWeight: '700',
    color: '#ff914d',
  },
});

export default DatenschutzBildschirm;
