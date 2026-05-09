<script setup lang="ts">
import type { RepeaterProps } from '~/utils/email-builder/schemas'
import { RepeaterPropsSchema } from '~/utils/email-builder/schemas'
import { useEmailEditor } from '~/composables/useEmailEditor'
import { ColorInput, SliderInput, PaddingInput, TextInput } from '../inputs'

const props = defineProps<{ data: RepeaterProps }>()
const emit = defineEmits<{ 'update:data': [value: RepeaterProps] }>()

const store = useEmailEditor()

const previewJsonText = ref('')
const previewJsonError = ref<string | null>(null)
const showHintDialog = ref(false)

const blockId = computed(() => store.selectedBlockId ?? '')

onMounted(() => {
  const existing = store.repeaterPreviewData[blockId.value]
  if (existing) {
    previewJsonText.value = JSON.stringify(existing, null, 2)
  }
})

function update(partial: Record<string, unknown>) {
  const merged = { ...props.data, ...partial }
  const res = RepeaterPropsSchema.safeParse(merged)
  if (res.success) emit('update:data', res.data)
}

function updateProps(partial: Record<string, unknown>) {
  update({ props: { ...props.data.props, ...partial } })
}

function onPreviewJsonChange(val: string) {
  previewJsonText.value = val
  if (!val.trim()) {
    previewJsonError.value = null
    delete store.repeaterPreviewData[blockId.value]
    return
  }
  try {
    const parsed = JSON.parse(val)
    if (!Array.isArray(parsed)) {
      previewJsonError.value = 'Must be a JSON array'
      return
    }
    previewJsonError.value = null
    store.repeaterPreviewData[blockId.value] = parsed
  } catch {
    previewJsonError.value = 'Invalid JSON'
  }
}

function clearPreviewData() {
  previewJsonText.value = ''
  previewJsonError.value = null
  delete store.repeaterPreviewData[blockId.value]
}
</script>

<template>
  <v-card-text>
    <div class="text-subtitle-2 mb-3">Repeater block</div>
    <div style="display: flex; flex-direction: column; gap: 16px">
      <TextInput
        label="Data variable"
        :model-value="data.props?.dataVariable ?? ''"
        @update:model-value="(v: string) => updateProps({ dataVariable: v })"
      />

      <v-divider />

      <ColorInput label="Background" :model-value="data.style?.backgroundColor" nullable @update:model-value="(v: string | null) => update({ style: { ...data.style, backgroundColor: v } })" />
      <ColorInput label="Background alternating" :model-value="data.style?.backgroundAlternatingColor" nullable @update:model-value="(v: string | null) => update({ style: { ...data.style, backgroundAlternatingColor: v } })" />
      <ColorInput label="Border color" :model-value="data.style?.borderColor" nullable @update:model-value="(v: string | null) => update({ style: { ...data.style, borderColor: v } })" />
      <SliderInput label="Border radius" :model-value="data.style?.borderRadius ?? 0" :min="0" :max="48" :step="4" units="px" @update:model-value="(v: number) => update({ style: { ...data.style, borderRadius: v } })" />
      <PaddingInput :model-value="data.style?.padding" @update:model-value="(v: any) => update({ style: { ...data.style, padding: v } })" />

      <v-divider />

      <div>
        <div class="d-flex align-center justify-space-between mb-1">
          <div class="text-subtitle-2">Preview data</div>
          <div class="d-flex" style="gap: 4px">
            <v-btn
              size="x-small"
              variant="text"
              color="primary"
              icon="mdi-help-circle-outline"
              @click="showHintDialog = true"
            />
            <v-btn
              v-if="previewJsonText.trim()"
              size="x-small"
              variant="text"
              color="error"
              @click="clearPreviewData"
            >
              Clear
            </v-btn>
          </div>
        </div>
        <div class="text-caption mb-2" style="color: rgba(0,0,0,0.5)">
          Enter a JSON array to preview repeated content. Only affects the Preview tab.
        </div>
        <v-textarea
          :model-value="previewJsonText"
          variant="outlined"
          density="compact"
          rows="4"
          placeholder='[{"name": "Matt", "position": "Bases"}]'
          :error-messages="previewJsonError ?? undefined"
          hide-details="auto"
          @update:model-value="onPreviewJsonChange"
        />
      </div>
    </div>
  </v-card-text>

  <v-dialog v-model="showHintDialog" max-width="600">
    <v-card>
      <v-card-title>Repeater Syntax Guide</v-card-title>
      <v-card-text>
        <div v-pre>
          <div class="rounded-lg pa-4 mb-4" style="background-color: #f5f5f5">
            <div class="text-subtitle-2 font-weight-bold mb-2" style="color: #1565C0">1. Simple array (strings/numbers)</div>
            <div class="text-caption mb-1"><strong>Data variable:</strong> <code>names</code></div>
            <div class="text-caption mb-1"><strong>Preview data:</strong></div>
            <pre class="text-caption pa-2 rounded mb-2" style="background: #fff; overflow-x: auto">["Matt", "Mitch", "Alex"]</pre>
            <div class="text-caption mb-1"><strong>In your template:</strong></div>
            <pre class="text-caption pa-2 rounded" style="background: #fff; overflow-x: auto">{{names}}</pre>
          </div>

          <div class="rounded-lg pa-4 mb-4" style="background-color: #f5f5f5">
            <div class="text-subtitle-2 font-weight-bold mb-2" style="color: #1565C0">2. Array of objects</div>
            <div class="text-caption mb-1"><strong>Data variable:</strong> <code>positions</code></div>
            <div class="text-caption mb-1"><strong>Preview data:</strong></div>
            <pre class="text-caption pa-2 rounded mb-2" style="background: #fff; overflow-x: auto">[
  { "name": "Matt", "position": "Bases" },
  { "name": "Mitch", "position": "Plate" }
]</pre>
            <div class="text-caption mb-1"><strong>In your template:</strong></div>
            <pre class="text-caption pa-2 rounded" style="background: #fff; overflow-x: auto">{{positions.name}} - {{positions.position}}</pre>
          </div>

          <div class="rounded-lg pa-4" style="background-color: #f5f5f5">
            <div class="text-subtitle-2 font-weight-bold mb-2" style="color: #1565C0">3. Nested arrays (repeater inside repeater)</div>
            <div class="text-caption mb-1"><strong>Outer data variable:</strong> <code>games</code></div>
            <div class="text-caption mb-1"><strong>Inner data variable:</strong> <code>games.assignments</code></div>
            <div class="text-caption mb-1"><strong>Preview data (on outer repeater):</strong></div>
            <pre class="text-caption pa-2 rounded mb-2" style="background: #fff; overflow-x: auto">[
  {
    "league": "LBMQ",
    "homeTeam": "Jets",
    "assignments": [
      { "position": "Plate", "name": "Matt" },
      { "position": "Bases", "name": "Mitch" }
    ]
  }
]</pre>
            <div class="text-caption mb-1"><strong>In outer template:</strong></div>
            <pre class="text-caption pa-2 rounded mb-2" style="background: #fff; overflow-x: auto">{{games.league}} - {{games.homeTeam}}</pre>
            <div class="text-caption mb-1"><strong>In inner template:</strong></div>
            <pre class="text-caption pa-2 rounded" style="background: #fff; overflow-x: auto">{{games.assignments.position}}: {{games.assignments.name}}</pre>
            <div class="text-caption mt-2" style="color: rgba(0,0,0,0.5)">
              The inner repeater automatically pulls its array from the outer item. No separate preview data is needed.
            </div>
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="showHintDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
