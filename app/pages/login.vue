<script setup lang="ts">
definePageMeta({ layout: false })

const auth = useAuth()
const apiKeyInput = ref('')
const showKey = ref(false)

if (import.meta.client && auth.isAuthenticated) {
  navigateTo('/')
}

async function handleLogin() {
  if (!apiKeyInput.value.trim()) return
  const success = await auth.login(apiKeyInput.value.trim())
  if (success) {
    navigateTo('/')
  }
}
</script>

<template>
  <v-app>
    <v-main class="d-flex align-center justify-center" style="min-height: 100vh;">
      <v-container class="d-flex align-center justify-center" fluid>
        <v-card
          class="pa-6 pa-sm-8"
          max-width="450"
          width="100%"
          elevation="8"
          rounded="lg"
        >
          <div class="text-center mb-6">
            <img src="/images/asm_logo.png" alt="ASportsManager" style="width: 100px; height: auto;" class="mb-3" />
            <h1 class="text-h5 font-weight-bold">Email Builder</h1>
            <p class="text-body-2 text-medium-emphasis mt-1">
              Enter your API key to continue
            </p>
          </div>

          <v-alert
            v-if="auth.error"
            type="error"
            variant="tonal"
            density="compact"
            class="mb-4"
            closable
            @click:close="auth.error = null"
          >
            {{ auth.error }}
          </v-alert>

          <v-form @submit.prevent="handleLogin">
            <v-text-field
              v-model="apiKeyInput"
              label="API Key"
              placeholder="Paste your API key"
              :type="showKey ? 'text' : 'password'"
              :append-inner-icon="showKey ? 'mdi-eye-off' : 'mdi-eye'"
              variant="outlined"
              density="comfortable"
              autofocus
              :disabled="auth.isValidating"
              @click:append-inner="showKey = !showKey"
            />

            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              :loading="auth.isValidating"
              :disabled="!apiKeyInput.trim()"
              class="mt-2"
            >
              Sign In
            </v-btn>
          </v-form>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>
