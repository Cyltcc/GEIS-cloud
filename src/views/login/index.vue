<template>
  <div class="login-page">
    <div class="login-header">
      <div class="header-box">
        <div class="header-box-inner">
          <img style="width: 60px; height: 60px;"
               src="../../assets/imgs/MAFF.png"
               alt="">
        </div>
        <div class="header-box-footer">
          MAFF
        </div>
      </div>
      <div class="header-box">
        <div class="header-box-inner">
          <img style="width: 60px; height: 60px;"
               src="../../assets/imgs/FAO.png"
               alt="">
        </div>
        <div class="header-box-footer">
          FAO
        </div>
      </div>
      <div class="header-box">
        <div class="header-box-inner">
          <img style="width: 148px; height: 40px;"
               src="../../assets/imgs/OCOP.png"
               alt="">
        </div>
        <div class="header-box-footer">
          OCOP
        </div>
      </div>
      <div class="header-box">
        <div class="header-box-inner">
          <img style="width: 60px; height: 60px;"
               src="../../assets/imgs/logo.png"
               alt="">
        </div>
        <div class="header-box-footer">
          GEIS
        </div>
      </div>
    </div>
    <div class="login-title">
      <div class="login-title-left-bg"></div>
      <div class="login-title-text">
        <div class="login-title-text-content">
          GIES Oddar Meanchey Site
        </div>
        <div class="login-title-low"></div>
        <div class="login-title-link">
          https://giescloud.com
        </div>
      </div>
      <div class="login-title-left-bg"
           style="transform: scaleX(-1);"></div>
    </div>
    <div class="login-footer">
      <div class="login-footer-bg">
        <div class="login-footer-line-layer">
          <span v-for="(dot, index) in footerDots"
                :key="index"
                class="footer-dot"
                :style="{ left: dot.left, top: dot.top, '--dot-delay': `${index * 0.18}s` }" />
        </div>
      </div>
      <div class="login-box">
        <div>
          <div class="login-box-title">
            Log in
          </div>
          <div class="login-box-form">
            <a-form v-model:values="formState">
              <a-form-item field="username">
                <a-input style="height: 48px; background-color: #f6f7fb;"
                         v-model:value="formState.username"
                         placeholder="Username or email"
                         @pressEnter="handleLogin"></a-input>
              </a-form-item>
              <a-form-item field="password">
                <a-input style="height: 48px; background-color: #f6f7fb;"
                         v-model:value="formState.password"
                         :type="showPassword ? 'text' : 'password'"
                         placeholder="Password"
                         @pressEnter="handleLogin">
                  <template #suffix>
                    <img class="password-toggle-icon"
                         :src="showPassword ? displayIcon :  concealIcon"
                         alt="toggle password visibility"
                         @click.stop="togglePasswordVisible">
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item field="verificationCode">
                <div style="display:flex; align-items: center;">
                  <a-input style="width: 228px; height: 48px; background-color: #f6f7fb;"
                           v-model:value="formState.verificationCode"
                           placeholder="Verification code"
                           @pressEnter="handleLogin"></a-input>
                  <ReImageVerify style="display: inline-block; vertical-align: middle; margin-left: 12px;"
                                 v-model:code="imgCode" />
                </div>
              </a-form-item>
              <a-form-item>
                <a-checkbox class="login-box-checkbox"
                            v-model:checked="formState.remember">
                  Remember me
                </a-checkbox>
              </a-form-item>
              <a-form-item>
                <a-button class="login-box-submit"
                          type="primary"
                          :loading="loginLoading"
                          @click="handleLogin">
                  Login
                </a-button>
              </a-form-item>
              <a-form-item>
                <div class="login-box-agreement">
                  <i class="agreement-radio-icon"
                     :class="agreementChecked ? 'i-custom:radio-select' : 'i-custom:radio-not'"
                     @click.stop="toggleAgreement" />
                  <div>
                    I agree to the <a class="agreement-link"
                       href="">Terms & Privacy Policy</a>
                  </div>
                </div>
              </a-form-item>
            </a-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { login, getUserInfo } from '@/api/auth'
import { setToken } from '@/utils/auth'
import { useUserStore } from '@/store/modules/user'
import concealIcon from '../../assets/icons/conceal.svg'
import displayIcon from '../../assets/icons/display.svg'
import ReImageVerify from '../../components/ReImageVerify/src/index.vue'

interface FooterDot {
  left: string
  top: string
}

interface FormState {
  username: string
  password: string
  verificationCode: string
  remember: boolean
}

const formState = reactive<FormState>({
  username: '',
  password: '',
  verificationCode: '',
  remember: false,
})

const showPassword = ref(false)
const imgCode = ref('')
const loginLoading = ref(false)
const router = useRouter()
const userStore = useUserStore()

const togglePasswordVisible = () => {
  showPassword.value = !showPassword.value
}

const agreementChecked = ref(true)

const toggleAgreement = () => {
  agreementChecked.value = !agreementChecked.value
}

type UnknownRecord = Record<string, unknown>

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null

const readString = (obj: UnknownRecord, keys: string[]): string => {
  for (const key of keys) {
    const value = obj[key]
    if (typeof value === 'string' && value.trim()) {
      return value
    }
  }
  return ''
}

const readNumber = (obj: UnknownRecord, keys: string[]): number => {
  for (const key of keys) {
    const value = obj[key]
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value
    }
    if (typeof value === 'string' && value.trim() && !Number.isNaN(Number(value))) {
      return Number(value)
    }
  }
  return 0
}

const parseResponseData = (payload: unknown): UnknownRecord => {
  if (!isRecord(payload)) {
    return {}
  }
  const innerData = payload.data
  if (isRecord(innerData)) {
    return innerData
  }
  return payload
}

const parseTokenPayload = (payload: unknown) => {
  const data = parseResponseData(payload)

  const accessToken = readString(data, ['accessToken', 'access_token', 'token'])
  const refreshToken = readString(data, ['refreshToken', 'refresh_token'])
  const expires = readNumber(data, ['expires', 'expires_in', 'expire'])

  return { accessToken, refreshToken, expires: expires > 0 ? expires : 7200 }
}

const handleLogin = async () => {
  if (loginLoading.value) {
    return
  }

  const username = formState.username.trim()
  const password = formState.password.trim()
  const verifyCode = formState.verificationCode.trim()

  if (!username) {
    message.warning('Please input username')
    return
  }
  if (!password) {
    message.warning('Please input password')
    return
  }
  if (!verifyCode) {
    message.warning('Please input verification code')
    return
  }
  if (verifyCode !== imgCode.value) {
    message.warning('Verification code is incorrect')
    return
  }
  if (!agreementChecked.value) {
    message.warning('Please agree to Terms & Privacy Policy')
    return
  }

  loginLoading.value = true
  try {
    const loginResp = await login({
      username,
      password,
      grant_type: 'password',
      client_id: '1',
      client_secret: ''
    })

    const { accessToken, refreshToken, expires } = parseTokenPayload(loginResp)
    if (!accessToken) {
      throw new Error('Login response missing token')
    }

    setToken({
      accessToken,
      refreshToken,
      expires,
      username,
      roles: []
    })

    try {
      const infoResp = await getUserInfo()
      const infoData = parseResponseData(infoResp)
      userStore.info = infoData
    } catch {
      userStore.info = {}
    }

    message.success('Login successful')
    await router.replace('/dashboard')
  } catch (error) {
    if (error instanceof Error && error.message === 'Login response missing token') {
      message.error('Login failed, token not found in response')
    }
  } finally {
    loginLoading.value = false
  }
}

const footerDots: FooterDot[] = [
  { left: '0%', top: '77%' },
  { left: '15%', top: '65%' },
  { left: '14%', top: '35%' },
  { left: '22.5%', top: '12%' },
  { left: '28.5%', top: '94%' },
  { left: '37%', top: '0.5%' },
  { left: '48.25%', top: '62%' },
  { left: '68.5%', top: '29.5%' },
  { left: '73.5%', top: '61%' },
  { left: '100%', top: '67%' },
  { left: '81.5%', top: '100%' },
]
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding-top: 40px;
  justify-content: flex-start;
  height: 100vh;
  background: rgba(245, 247, 250, 1);

  .login-header {
    z-index: 99;
    width: min(1500px, calc(100% - 32px));
    height: 120px;
    display: flex;
    justify-content: space-between;

    .header-box {
      width: 360px;
      height: 120px;
      border-radius: 2px;
      border: 2px solid #fff;
      box-shadow: 0px 8px 8px 2px rgba(0, 0, 0, 0.05);

      .header-box-inner {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 96px;
        background: linear-gradient(180deg, #f4f5f8 0%, #fefefe 100%);
      }

      .header-box-footer {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        color: #8b8b8b;
        width: 100%;
        height: 24px;
        background: linear-gradient(180deg, #f4f5f8 0%, #fefefe 100%);
      }
    }
  }

  .login-title {
    width: 100%;
    height: 330px;
    background-color: #fff;
    margin-top: -60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;

    .login-title-left-bg {
      width: 671px;
      height: 330px;
      background-image: url(../../assets/imgs/login-title-bg.png);
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center -115px;
    }

    .login-title-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .login-title-text-content {
      width: 1000px;
      height: 60px;
      font-family: Roboto;
      font-weight: 900;
      background: linear-gradient(180deg, #3969fa 0%, #2a3553 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      font-size: 60px;
      line-height: 60px;
      letter-spacing: 8%;
      text-align: center;
      margin-bottom: 15px;
    }

    .login-title-low {
      width: 940px;
      height: 1px;
      flex-shrink: 0;
      margin-bottom: 15px;
      background: linear-gradient(
        90deg,
        rgba(211, 219, 232, 0) 0%,
        rgba(57, 105, 250, 0.5) 50%,
        rgba(211, 219, 232, 0) 100%
      );
    }

    .login-title-link {
      width: 320px;
      height: 32px;
      background: linear-gradient(
        90deg,
        rgba(245, 247, 250, 0) 0%,
        #f5f7fa 50%,
        rgba(245, 247, 250, 0) 100%
      );
      font-family: Roboto;
      font-weight: 400;
      font-style: Regular;
      font-size: 16px;
      line-height: 32px;
      letter-spacing: 0%;
      text-align: center;
    }
  }

  .login-footer {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-end;
    position: relative;

    .login-footer-bg {
      position: relative;
      width: 100%;
      height: calc(100% - 120px);
      bottom: 0;
      background-image: url(../../assets/imgs/login-footer-bg.png);
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center 0;
      overflow: hidden;

      .login-footer-line-layer {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 1495.5px;
        height: 439px;
        background-image: url(../../assets/imgs/login-footer-line.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center center;
        pointer-events: none;
        z-index: 1;
      }

      .footer-dot {
        position: absolute;
        width: 10px;
        height: 10px;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background: #3f6dff;
        box-shadow: 0 0 0 3px rgba(92, 132, 255, 0.24),
          0 0 8px rgba(74, 118, 255, 0.5);
        animation: dot-flicker 2.2s ease-in-out infinite;
        animation-delay: var(--dot-delay, 0s);
        z-index: 2;
        pointer-events: none;
      }
    }

    .login-box {
      position: absolute;
      left: 50%;
      top: 45%;
      transform: translate(-50%, -50%);
      border-radius: 15px;
      width: 440px;
      height: 530px;
      padding: 25px;
      background-color: #fff;
      z-index: 999;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .login-box-title {
        font-family: Roboto;
        font-weight: 600;
        font-style: SemiBold;
        font-size: 24px;
        line-height: 32px;
        letter-spacing: 0%;
        text-align: center;
      }
      .login-box-form {
        margin-top: 40px;
        width: 360px;
        height: 378px;

        :deep(.ant-input) {
          background-color: #f6f7fb;
        }

        .login-box-checkbox {
          font-family: Roboto;
          font-weight: 400;
          font-style: Regular;
          font-size: 14px;
          line-height: 150%;
          letter-spacing: 0%;
          vertical-align: middle;
        }

        .login-box-submit {
          width: 100%;
          height: 48px;
          background-color: #3f6dff;
          border: none;
        }

        .login-box-agreement {
          width: 320px;
          height: 21px;
          line-height: 21px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          text-align: center;
          font-family: Roboto;
          margin: 0 auto;
        }
        .agreement-radio-icon {
          width: 16px;
          height: 16px;
          cursor: pointer;
          font-size: 16px;
        }

        .agreement-link {
          text-decoration-line: underline;
          color: #3f6dff;
        }
      }

      .password-toggle-icon {
        width: 20px;
        height: 20px;
        cursor: pointer;
        display: block;
      }
    }
  }
}

@keyframes dot-flicker {
  0%,
  100% {
    opacity: 0.85;
    transform: translate(-50%, -50%) scale(0.88);
    box-shadow: 0 0 0 2px rgba(92, 132, 255, 0.2),
      0 0 6px rgba(74, 118, 255, 0.3);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.15);
    box-shadow: 0 0 0 4px rgba(92, 132, 255, 0.38),
      0 0 14px rgba(74, 118, 255, 0.72);
  }
}
</style>
