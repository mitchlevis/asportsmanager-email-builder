<script setup lang="ts">
import { useEmailEditor } from '~/composables/useEmailEditor'
import { SAMPLE_TEMPLATES } from '~/utils/email-builder/sample-templates'

const store = useEmailEditor()

const SAMPLES_DRAWER_WIDTH = 240

function loadSample(index: number) {
  store.loadTemplate(JSON.parse(JSON.stringify(SAMPLE_TEMPLATES[index].value)))
}
</script>

<template>
  <v-navigation-drawer
    :model-value="store.samplesDrawerOpen"
    location="left"
    :width="SAMPLES_DRAWER_WIDTH"
    permanent
  >
    <div class="d-flex flex-column justify-space-between" style="height: 100%">
      <div class="pa-4">
        <div class="text-h6 mb-4">Email Builder</div>
        <v-list density="compact" nav>
          <v-list-item
            v-for="(sample, i) in SAMPLE_TEMPLATES"
            :key="i"
            :title="sample.label"
            @click="loadSample(i)"
          />
        </v-list>
      </div>
    </div>
  </v-navigation-drawer>
</template>
