<template>
  <v-card class="entryList">
    <v-row no-gutters class="boxHeader">
      <v-col class="text-button text-white">
        <v-icon class="mx-1"> mdi-view-list </v-icon>
        Gespeicherte Eingaben
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup></script>

<style scoped>
.details {
  cursor: pointer;
}
.entryList {
  position: absolute;
  left: 10px;
  top: 60px;
  width: 350px;
  height: calc(50vh - 40px);
  min-height: calc(50vh - 40px);
  overflow: auto;
}

.boxHeader .v-col {
  height: 30px;
  line-height: 30px;
  background-color: #777;
}

.schlagTools button {
  display: block;
}
</style>
