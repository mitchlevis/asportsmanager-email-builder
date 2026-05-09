<script setup lang="ts">
import { useEmailEditor } from '~/composables/useEmailEditor'
import StylesPanel from '~/components/email-builder/inspector/StylesPanel.vue'
import ConfigurationPanel from '~/components/email-builder/inspector/ConfigurationPanel.vue'

const store = useEmailEditor()

const INSPECTOR_DRAWER_WIDTH = 320
</script>

<template>
  <v-navigation-drawer
    :model-value="store.inspectorDrawerOpen"
    location="right"
    :width="INSPECTOR_DRAWER_WIDTH"
    permanent
    :style="{ borderLeft: '1px solid rgba(0,0,0,0.12)' }"
  >
    <div :style="{ height: '49px', borderBottom: '1px solid rgba(0,0,0,0.12)' }">
      <v-tabs
        :model-value="store.selectedSidebarTab"
        @update:model-value="(v: string) => store.selectedSidebarTab = v as any"
      >
        <v-tab value="styles">Styles</v-tab>
        <v-tab value="block-configuration">Inspect</v-tab>
      </v-tabs>
    </div>
    <div :style="{ height: 'calc(100% - 49px)', overflow: 'auto' }">
      <StylesPanel v-if="store.selectedSidebarTab === 'styles'" />
      <ConfigurationPanel v-else />
    </div>
  </v-navigation-drawer>
</template>
