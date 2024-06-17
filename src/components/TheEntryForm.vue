<template>
  <v-card class="entryForm">
    <v-row no-gutters class="boxHeader">
      <v-col class="text-button text-white">
        <v-icon class="mx-1"> mdi-list-box </v-icon>
        Dateneingabe
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup></script>

<style scoped>
.details {
  cursor: pointer;
}
.entryForm {
  position: absolute;
  left: 370px;
  top: 60px;
  width: 450px;
  height: calc(100vh - 70px);
  min-height: calc(100vh - 70px);
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
