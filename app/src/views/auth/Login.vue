<script setup>
import UButton from '@/components/ui/UButton.vue'
import Dropdown from '@/components/ui/RegDropdown.vue'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { fetchOperators } from '@/api/operators'
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const authStore = useAuthStore()
const router = useRouter()
const pilgrimServiceList = ref([])
const hasErrorAlert = ref(false)

const form = reactive({
    serviceId: {
        value: ''
    },
    email: {
        value: '',
        isVisible: true
    },
    password: {
        value: '',
        isVisible: true
    }
})

function inFocus(input){
    form[input].isVisible = false
}
function outFocus(input){
    if(!form[input].value){
        form[input].isVisible = true
    }
}
function selectService(key){
    form.serviceId.value = key
}

async function login(){
    for(const key in form){
        if(!form[key].value){
            return
        }
    }
    const credentials = {
        // tour_operator_id: form.serviceId.value,
        email: form.email.value,
        password: form.password.value
    };

    try {
        await authStore.login(credentials)
        localStorage.setItem('tour_operator_id', form.serviceId.value)
        router.push({ name: 'home' })
    } catch (error) {
        console.error('Login failed:', authStore.error)
        hasErrorAlert.value = true

        setTimeout(() => {
            hasErrorAlert.value = false
        }, 3000) // Автоскрытие через 3 сек
    }

}

onMounted(async () => {
    try {
        pilgrimServiceList.value = await fetchOperators()
    } catch (err) {
        console.error('Ошибка:', err)
    }
})
</script>

<template>
    <div class="login-wrapper">
        <div class="header">
            <div class="header-title">
                Войти в систему
            </div>
            <div class="header-description">
                Введите свою электронную почту и пароль.
            </div>
        </div>
        <div class="inputs">
            <Dropdown
                :list="pilgrimServiceList"
                @update="selectService"
            />
            <div class="input-login-wrapper">
                <input
                    type="email"
                    class="input email"
                    v-model="form.email.value"
                    id="email-input"
                    @focus="inFocus('email')"
                    @blur="outFocus('email')"
                />
                <label
                    class="input-login-wrapper__placeholder-item"
                    v-show="form.email.isVisible"
                    for="email-input"
                >
                    <img src="/svg/mail.svg" />
                    <span>E-mail</span>
                </label>
            </div>
            <div class="input-login-wrapper">
                <input
                    type="password"
                    class="input password"
                    v-model="form.password.value"
                    id="password-input"
                    @focus="inFocus('password')"
                    @blur="outFocus('password')"
                />
                <label
                    class="input-login-wrapper__placeholder"
                    v-show="form.password.isVisible"
                    for="password-input"
                >
                    <div class="input-login-wrapper__placeholder-block">
                        <img src="/svg/lock.svg" />
                        <span>Пароль</span>
                    </div>
                    <img src="/svg/eye.svg" />
                </label>
            </div>
            <router-link to="/" class="forget">Забыли пароль?</router-link>
        </div>
        <div class="enter">
            <UButton
                variant="primary"
                size="medium"
                action="normal"
                text="Вход"
                class="enter__button"
                @click="login"
            />
            <div class="enter__description">
                У вас нет аккаунта? <router-link :to="{name:'register'}" class="forget">Регистрация</router-link>
            </div>
        </div>
    </div>
    <Alert variant="destructive" v-show="hasErrorAlert" class="fixed top-4 right-4 w-[350px] p-2 z-50 shadow-lg">
        <AlertTitle>Ошибка!</AlertTitle>
        <AlertDescription>
            {{ authStore.error }}
        </AlertDescription>
    </Alert>
</template>

<style lang="scss" scoped>
.login-wrapper {
    width: 520px;
    height: 100%;
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    background-color: #fff;
    border-radius: 24px;
}

.header {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &-title {
        font-weight: 500;
        font-size: 32px;
        background-color: #fff;
    }

    &-description {
        font-weight: 400;
        font-size: 14px;
        background-color: #fff;
        color: #717173;
    }
}

.inputs {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.input {
    width: 100%;
    height: 56px;
    position: relative;
    padding: 0 23px;
    outline: 1px solid #D4D6D9;
    border: none;
    border-radius: 12px;
    font-weight: 400;
    font-size: 16px;

    &:focus {
        border: none
    }

    &-login-wrapper {
        position: relative;
        width: 100%;

        &__placeholder {
            width: calc(100% - 48px);
            position: absolute;
            display: flex;
            justify-content: space-between;
            top: calc(100% / 2 - 9px);
            left: 24px;
            color: #6A6E75;

            &-block {
                display: flex;
                gap: 12px;
                top: calc(100% / 2 - 9px);
                left: 24px;
            }

            &-item {
                position: absolute;
                display: flex;
                gap: 12px;
                left: 24px;
                top: calc(100% / 2 - 9px);
                color: #6A6E75;
            }
        }
    }

    input {
        display: block;
    }
}

.forget {
    font-weight: 400;
    font-size: 14px;
    width: 115px;
    color: #768187;
}

.enter {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    &__button {
        width: 100%;
    }

    &__description {
        font-weight: 400;
        font-size: 16px;

        & .forget {
            font-weight: 600;
            font-size: 16px;
            color: #10B981;
        }
    }
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s ease-in;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
