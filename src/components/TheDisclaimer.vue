<template>
  <v-dialog persistent v-model="showOverlay" max-width="1000">
    <v-card>
      <v-row no-gutters class="overflow-auto"
        ><v-col cols="12">
          <p class="pa-4">
            <strong>
              Sehr geehrte Benutzerin, sehr geehrter Benutzer, herzlichen Dank, dass Sie den INB des
              BML verwenden.
            </strong>
          </p>
          <p class="px-4 py-2">
            Das BML ist aufgrund EU-rechtlicher Vorgaben gemäß Art 15, Abs 4, Buchstabe (g), der
            GAP-Strategieplan-VO, Nr. 2115/2021 zur Bereitstellung eines
            Betriebsnachhaltigkeitsinstruments für Nährstoffe (Integrierte Nährstoff Bilanz- INB) in
            Österreich verpflichtet.
          </p>
          <p class="px-4 py-2">
            Aus den Karteninhalten (Darstellungen) und den dazugehörenden Texten können
            Rechtsansprüche weder begründet noch abgeleitet werden. Das Bundesministerium für Land-
            und Forstwirtschaft, Regionen und Wasserwirtschaft (BML) übernimmt keine Haftung für
            Richtigkeit, Vollständigkeit, Aktualität oder dauernde Verfügbarkeit dieses
            Webkartendienstes. Die Karten und Texte sind keine amtliche Auskunft oder
            rechtsverbindliche Aussage. Amtliche Auskünfte zu einem bestimmten Gebiet oder einer
            bestimmten Frage erteilt auf Anfrage die zuständige Behörde.
          </p>
          <p class="px-4 py-2">
            Der INB stellt Nährstoffverhältnisse auf Schlagebene dar und soll Empfehlungen für den
            Einsatz von Düngemitteln geben, wodurch eine vorausschauende Planung der eingesetzten
            Mittel unterstützt wird. Die dargestellten Kartenlayer sind anonymisiert und dienen
            ausschließlich zur Planung. Der Inhalt dieser Internetseite kann sich, insbesondere
            aufgrund unterschiedlicher Aktualität, von der Publikation des e-AMA (Schläge)
            unterscheiden.
          </p>
          <p class="px-4 py-2">
            Alle Angaben (Berechnungsergebnisse) sind trotz sorgfältigster Bearbeitung/Verarbeitung
            ohne Gewähr und nicht rechtsverbindlich. Eine Haftung des BML für Nachteile, die
            aufgrund der auf INB.Agrarforschung.at angezeigten und abgefragten Inhalte entstanden
            sind, wird ausgeschlossen. Das BML behält sich ausdrücklich vor, Inhalte des INB
            jederzeit ohne Ankündigung ganz oder teilweise zu ändern, zu ergänzen, zu löschen oder
            zeitweise nicht zu veröffentlichen.
          </p>
          <p class="px-4 py-2">
            Dieser Webkartendienst wird vom Unternehmen
            <a href="https://www.w3geo.at" target="_blank">W3Geo GmbH</a> betrieben. W3Geo übernimmt
            keinerlei Haftung für Schäden oder Mängelfolgeschäden, welche durch die Verwendung
            dieses Webdienstes und all seiner Inhalte entstehen. Die Nutzung der Inhalte dieses
            Webdienstes erfolgt ausschließlich auf Risiko der Benutzerin bzw. des Benutzers.
          </p>
          <p class="px-4 py-2">
            Anmerkung zur Barrierefreiheit: Diese Webseite ist mit dem Bundesgesetz über den
            barrierefreien Zugang zu Websites und mobilen Anwendungen des Bundes
            (Web-Zugänglichkeits-Gesetz – WZG), BGBl. I Nr. 59/2019 vereinbar.Gemäß § 2 Abs. 3 lit.
            d muss die Webseite nicht den, in dem oben angeführten Bundesgesetz normierten
            Anforderungen an die Barrierefreiheit genügen, da Online-Karten und Kartendienste, die
            nicht der Navigation dienen, vom Regelungsumfang ausgenommen sind. Bei Fragen zur
            barrierefreien Lesbarkeit des Kartenteiles wenden Sie sich bitte an den im Impressum
            angegebenen Kontakt.
          </p>
          <p class="px-4 py-2">
            Die Finanzierung des Auftrags erfolgt über das Österreichische Programm zur Entwicklung
            des Ländlichen Raumes 2014-2020 aus Mitteln der Technischen Hilfe.
          </p>
          <p class="px-4 py-2">
            <strong
              >Ich habe die obigen Bestimmungen gelesen und nehme diese rechtsverbindlich
              an.</strong
            >
          </p>
          <p class="px-4 py-4" align="center">
            <img width="100%" src="/foerdergeberleiste.png" />
          </p>

          <p class="px-4 py-2"></p></v-col
      ></v-row>
      <v-row no-gutters class="pa-4 bg-grey-lighten-3">
        <v-col cols="8"
          ><v-checkbox
            hide-details
            density="compact"
            v-model="neverShowOverlay"
            label="Diesen Dialog nicht mehr anzeigen"
        /></v-col>
        <v-col cols="4" align="right"
          ><v-btn color="green" @click.stop="closeDialog">Akzeptieren</v-btn></v-col
        >
      </v-row>
      <v-row no-gutters class="pa-4 bg-grey-lighten-2" align="center">
        <v-col cols="12"
          >Feedback / Fehlermeldungen? Bitte kontaktieren Sie uns mit einer möglichst exakten
          Beschreibung unter <a href="service.inb@bml.gv.at">service.inb@bml.gv.at</a>.</v-col
        >
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { onMounted } from 'vue';
import { useDisclaimer } from '../composables/useDisclaimer.js';

const { showOverlay, neverShowOverlay } = useDisclaimer();

onMounted(() => {
  if (!localStorage.getItem('fasttooldisclaimer')) {
    showOverlay.value = true;
  }
});

function closeDialog() {
  if (neverShowOverlay.value) {
    localStorage.setItem('fasttooldisclaimer', 'hide');
  }
  showOverlay.value = false;
}
</script>

<style scoped></style>
