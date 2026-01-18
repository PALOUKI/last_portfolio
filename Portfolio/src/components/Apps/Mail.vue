<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  windowId: string
}>();

const senderName = ref('');
const senderEmail = ref('');
const subject = ref('');
const message = ref('');
const status = ref<'idle' | 'sending' | 'success' | 'error'>('idle');
const statusMessage = ref('');

function sendEmail() {
  // Validate form
  if (!senderName.value.trim() || !senderEmail.value.trim() || !message.value.trim()) {
    status.value = 'error';
    statusMessage.value = 'Please fill in all required fields.';
    setTimeout(() => {
      status.value = 'idle';
      statusMessage.value = '';
    }, 3000);
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(senderEmail.value)) {
    status.value = 'error';
    statusMessage.value = 'Please enter a valid email address.';
    setTimeout(() => {
      status.value = 'idle';
      statusMessage.value = '';
    }, 3000);
    return;
  }

  // Create mailto link with encoded data
  const mailtoLink = `mailto:paloukigodbless39@gmail.com?subject=${encodeURIComponent(subject.value || 'Message from Portfolio')}&body=${encodeURIComponent(
    `From: ${senderName.value}\nEmail: ${senderEmail.value}\n\nMessage:\n${message.value}`
  )}`;

  // Open default mail client
  status.value = 'sending';
  statusMessage.value = 'Opening your mail client...';
  
  window.location.href = mailtoLink;

  // Reset form after a delay
  setTimeout(() => {
    status.value = 'success';
    statusMessage.value = 'Mail client opened! Please send your message from there.';
    setTimeout(() => {
      senderName.value = '';
      senderEmail.value = '';
      subject.value = '';
      message.value = '';
      status.value = 'idle';
      statusMessage.value = '';
    }, 3000);
  }, 1000);
}
</script>

<template>
  <div class="mail-app">
    <div class="mail-header">
      <h2>📧 New Message</h2>
      <p class="recipient">To: <strong>paloukigodbless39@gmail.com</strong></p>
    </div>

    <div class="mail-body">
      <form @submit.prevent="sendEmail" class="mail-form">
        <div class="form-group">
          <label for="senderName">Your Name *</label>
          <input 
            id="senderName"
            v-model="senderName" 
            type="text" 
            placeholder="John Doe"
            :disabled="status === 'sending'"
          />
        </div>

        <div class="form-group">
          <label for="senderEmail">Your Email *</label>
          <input 
            id="senderEmail"
            v-model="senderEmail" 
            type="email" 
            placeholder="john.doe@example.com"
            :disabled="status === 'sending'"
          />
        </div>

        <div class="form-group">
          <label for="subject">Subject</label>
          <input 
            id="subject"
            v-model="subject" 
            type="text" 
            placeholder="Message from Portfolio"
            :disabled="status === 'sending'"
          />
        </div>

        <div class="form-group">
          <label for="message">Message *</label>
          <textarea 
            id="message"
            v-model="message" 
            rows="8" 
            placeholder="Write your message here..."
            :disabled="status === 'sending'"
          ></textarea>
        </div>

        <div class="form-actions">
          <button 
            type="submit" 
            class="send-btn"
            :disabled="status === 'sending'"
            :class="{ sending: status === 'sending' }"
          >
            <span v-if="status === 'sending'">📨 Opening Mail Client...</span>
            <span v-else>✉️ Send Message</span>
          </button>
        </div>

        <div v-if="statusMessage" class="status-message" :class="status">
          {{ statusMessage }}
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mail-app {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #e0e5ec;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.mail-header {
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 100%);
  background-image: 
    radial-gradient(circle at 15% 50%, rgba(76, 29, 149, 0.4), transparent 50%), 
    radial-gradient(circle at 85% 30%, rgba(219, 39, 119, 0.25), transparent 50%), 
    linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 100%);
  color: #ffffff;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  h2 {
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 700;
    color: #ffffff;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 246, 0.3);
  }
  
  .recipient {
    margin: 0;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
    
    strong {
      font-weight: 600;
      color: #ffffff;
      text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
    }
  }
}

.mail-body {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  background: #e0e5ec;
  
  @media (max-width: 768px) {
    padding: 20px 16px 100px 16px; // Extra bottom padding for mobile dock
  }
}

.mail-form {
  max-width: 600px;
  margin: 0 auto;
  background: #e0e5ec;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 9px 9px 16px #b8b9be, -9px -9px 16px #fff;
}

.form-group {
  margin-bottom: 24px;
  
  label {
    display: block;
    font-weight: 600;
    margin-bottom: 10px;
    color: #2d3748;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  input, textarea {
    width: 100%;
    padding: 12px 16px;
    border: none;
    border-radius: 12px;
    font-size: 14px;
    font-family: inherit;
    background: #e0e5ec;
    color: #2d3748;
    box-shadow: inset 3px 3px 6px #b8b9be, inset -3px -3px 6px #fff;
    transition: box-shadow 0.2s;
    
    &:focus {
      outline: none;
      box-shadow: inset 4px 4px 8px #b8b9be, inset -4px -4px 8px #fff;
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    &::placeholder {
      color: #9ca3af;
    }
  }
  
  textarea {
    resize: vertical;
    min-height: 150px;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}

.send-btn {
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 100%);
  background-image: 
    radial-gradient(circle at 15% 50%, rgba(76, 29, 149, 0.4), transparent 50%), 
    radial-gradient(circle at 85% 30%, rgba(219, 39, 119, 0.25), transparent 50%), 
    linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 100%);
  color: #ffffff;
  border: none;
  padding: 14px 32px;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 5px 5px 15px rgba(15, 23, 42, 0.4), -2px -2px 8px rgba(255, 255, 255, 0.1);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 7px 7px 20px rgba(15, 23, 42, 0.5), -2px -2px 10px rgba(255, 255, 255, 0.15);
    filter: brightness(1.2);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 3px 3px 10px rgba(15, 23, 42, 0.3), inset 0 2px 5px rgba(0, 0, 0, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.sending {
    animation: pulse 1.5s ease-in-out infinite;
  }
}

.status-message {
  margin-top: 14px;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  text-align: center;
  font-weight: 500;
  
  &.error {
    background: #fff0f0;
    color: #d1001c;
    border: 1px solid #ffd4d4;
  }
  
  &.success {
    background: #f0fff0;
    color: #28a745;
    border: 1px solid #d4ffd4;
  }
  
  &.sending {
    background: #fff8e6;
    color: #947a00;
    border: 1px solid #ffe9b3;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
</style>
