import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "../components/AppHeader";

interface AGBBildschirmProps {
  onClose: () => void;
}

const AGBBildschirm: React.FC<AGBBildschirmProps> = ({ onClose }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1a0a0a", "#2a0f0f", "#1f0808"]}
        style={StyleSheet.absoluteFillObject}
      />

      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <AppHeader
          onBackPress={onClose}
          showBackButton={true}
          greetingText="Allgemeine Geschäftsbedingungen"
        />

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.lastUpdated}>Stand: Dezember 2025</Text>

            <Text style={styles.sectionTitle}>1. Geltungsbereich</Text>
            <Text style={styles.paragraph}>
              Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die
              Nutzung der SelfIQ-App ("die App"), die von Andre Andorfer
              ("Anbieter", "wir", "uns") bereitgestellt wird. Durch die Nutzung
              der App erklären Sie sich mit diesen AGB einverstanden.
            </Text>

            <Text style={styles.sectionTitle}>2. Vertragsgegenstand</Text>
            <Text style={styles.paragraph}>
              SelfIQ ist eine mobile Anwendung für wissenschaftlich fundierte
              Persönlichkeitstests mit KI-gestützter Auswertung. Die App
              ermöglicht es Nutzern:{"\n\n"}• 37 verschiedene psychologische
              Tests durchzuführen{"\n"}• Detaillierte Persönlichkeitsanalysen zu
              erhalten{"\n"}• Fortschritte zu speichern und zu vergleichen{"\n"}
              • Ergebnisse wissenschaftlich fundiert auszuwerten
            </Text>

            <Text style={styles.sectionTitle}>3. Nutzungsmodus</Text>
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>3.1 Gast-Modus:{"\n"}</Text>• 72 Stunden
              kostenlose Testphase{"\n"}• Ein Gerät = ein Gastname (keine
              Mehrfachnutzung){"\n"}• Nach Ablauf keine weitere Gast-Nutzung
              möglich{"\n"}• Tests können nur innerhalb der 72h durchgeführt
              werden{"\n\n"}
              <Text style={styles.bold}>3.2 Apple Sign-In:{"\n"}</Text>•
              Unbegrenzte Nutzung aller Funktionen{"\n"}• Sichere
              Datenspeicherung über Apple-ID{"\n"}• Geräteübergreifende
              Synchronisation{"\n"}• Fortschritte werden dauerhaft gespeichert
            </Text>

            <Text style={styles.sectionTitle}>4. Nutzungsrechte</Text>
            <Text style={styles.paragraph}>
              Mit dem Download der App erhalten Sie ein nicht-exklusives, nicht
              übertragbares, widerrufliches Recht zur privaten,
              nicht-kommerziellen Nutzung. Untersagt sind:{"\n\n"}• Reverse
              Engineering oder Dekompilierung{"\n"}• Kommerzielle Nutzung ohne
              Genehmigung{"\n"}• Verbreitung oder Weitergabe von Inhalten{"\n"}•
              Manipulation oder Umgehung von Sicherheitsmechanismen
            </Text>

            <Text style={styles.sectionTitle}>
              5. Datenspeicherung und Synchronisation
            </Text>
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>Gast-Nutzer:{"\n"}</Text>• Daten werden
              lokal auf dem Gerät gespeichert{"\n"}• Nach 72h wird der Account
              gesperrt{"\n"}• Datenmigration zu Apple-Account möglich{"\n\n"}
              <Text style={styles.bold}>Apple-Nutzer:{"\n"}</Text>• Daten werden
              in Supabase-Datenbank gespeichert{"\n"}• Geräteübergreifende
              Synchronisation{"\n"}• Sichere Verschlüsselung nach EU-Standards
            </Text>

            <Text style={styles.sectionTitle}>6. Verfügbarkeit</Text>
            <Text style={styles.paragraph}>
              Wir bemühen uns um eine hohe Verfügbarkeit (99% Uptime), können
              jedoch keine ununterbrochene oder fehlerfreie Verfügbarkeit
              garantieren. Wartungsarbeiten werden nach Möglichkeit außerhalb
              der Hauptnutzungszeiten durchgeführt.
            </Text>

            <Text style={styles.sectionTitle}>
              7. Wissenschaftlicher Haftungsausschluss
            </Text>
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>WICHTIG:{"\n\n"}</Text>• Die
              Testergebnisse dienen ausschließlich zu Informations- und
              Unterhaltungszwecken{"\n"}• Sie ersetzen KEINE professionelle
              psychologische Beratung, Diagnose oder Therapie{"\n"}• Die
              KI-Auswertung basiert auf etablierten psychologischen Modellen,
              ist aber keine medizinische Diagnose{"\n"}• Bei psychischen
              Problemen wenden Sie sich bitte an einen Facharzt oder
              Psychotherapeuten{"\n\n"}
              Wir übernehmen keine Haftung für Entscheidungen, die auf Basis der
              Testergebnisse getroffen werden.
            </Text>

            <Text style={styles.sectionTitle}>8. Geistiges Eigentum</Text>
            <Text style={styles.paragraph}>
              Alle Inhalte der App (Texte, Grafiken, Logo, Tests,
              Auswertungsalgorithmen) sind urheberrechtlich geschützt und
              Eigentum von Andre Andorfer oder lizenziert. Die Nutzung ist
              ausschließlich im Rahmen dieser AGB gestattet.
            </Text>

            <Text style={styles.sectionTitle}>9. Haftungsbeschränkung</Text>
            <Text style={styles.paragraph}>
              Wir haften nur bei Vorsatz und grober Fahrlässigkeit. Die Haftung
              für leichte Fahrlässigkeit ist ausgeschlossen, soweit gesetzlich
              zulässig. Dies gilt nicht für die Verletzung von Leben, Körper
              oder Gesundheit.
            </Text>

            <Text style={styles.sectionTitle}>10. Änderungen der AGB</Text>
            <Text style={styles.paragraph}>
              Wir behalten uns vor, diese AGB jederzeit zu ändern. Über
              wesentliche Änderungen werden Sie per In-App-Benachrichtigung
              informiert. Die fortgesetzte Nutzung gilt als Zustimmung zu den
              geänderten AGB.
            </Text>

            <Text style={styles.sectionTitle}>11. Kündigung</Text>
            <Text style={styles.paragraph}>
              Sie können die Nutzung jederzeit durch Deinstallation der App
              beenden. Wir behalten uns vor, Nutzerkonten bei Verstoß gegen
              diese AGB zu sperren oder zu löschen.
            </Text>

            <Text style={styles.sectionTitle}>
              12. Anwendbares Recht und Gerichtsstand
            </Text>
            <Text style={styles.paragraph}>
              Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss
              des UN-Kaufrechts. Gerichtsstand ist Pocking, sofern gesetzlich
              zulässig.
            </Text>

            <Text style={styles.sectionTitle}>13. Salvatorische Klausel</Text>
            <Text style={styles.paragraph}>
              Sollten einzelne Bestimmungen dieser AGB unwirksam sein, berührt
              dies die Wirksamkeit der übrigen Bestimmungen nicht.
            </Text>

            <Text style={styles.sectionTitle}>14. Kontakt</Text>
            <Text style={styles.paragraph}>
              Bei Fragen zu diesen AGB können Sie uns erreichen unter:{"\n\n"}
              <Text style={styles.bold}>Andre Andorfer{"\n"}</Text>
              Mozartstr. 11{"\n"}
              94060 Pocking{"\n"}
              Deutschland{"\n\n"}
              E-Mail: support@selfiq.app{"\n"}
              (Reaktionszeit: innerhalb von 48 Stunden)
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    flex: 1,
    textAlign: "center",
    fontFamily: "neosans",
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
    color: "#ff914d",
    marginBottom: 30,
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ff3131",
    marginTop: 25,
    marginBottom: 15,
    fontFamily: "neosans",
  },
  paragraph: {
    fontSize: 15,
    color: "#e0e0e0",
    lineHeight: 24,
    marginBottom: 15,
  },
  bold: {
    fontWeight: "700",
    color: "#ff914d",
  },
});

export default AGBBildschirm;
