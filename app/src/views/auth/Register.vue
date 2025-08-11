<script setup>
import axios from 'axios'
import Header from '@/views/auth/AuthHeader.vue'
import UButton from '@/components/ui/UButton.vue'
import regInput from '@/components/ui/RegInput.vue'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import regDropdown from '@/components/ui/RegDropdown.vue'
import { fetchOperators } from '@/api/operators'

const router = useRouter()

const pilgrimServiceList = ref([])
const agreement = ref(false)
const form = reactive({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    tour_operator_id: ''
})

async function registration(){
    if(!agreement.value) return
    try{
        const { data } = await axios.post('http://pilgrim.tour-click.ru:8080/api/auth/register', form)
        if(data.code == 201){
            router.push({ name: 'login' })
        }
    } catch (error) {
    console.error('Registration failed:', error)
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
    <div class="register-wrapper">
        <Header 
            title="Регистрация" 
            description="Регистрация на портале доступна только паломническим службам, зарегистрированным в Едином реестре паломнических служб (центров) Русской Православной Церкви"
        />
        <div class="inputs">
            <regDropdown 
                :list="pilgrimServiceList" 
                @update="form.tour_operator_id = $event"
            />
            <div class="inputs__row">
                <regInput
                    id="name"
                    inputType="text" 
                    firstIconPath="/svg/user.svg" 
                    placeholder="Имя пользователя"
                    @update="form.name = $event"
                />
                <regInput
                    id="email"
                    inputType="email" 
                    firstIconPath="/svg/mail.svg" 
                    placeholder="E-mail"
                    @update="form.email = $event"
                />
            </div>
            <regInput
                id="password"
                inputType="password" 
                firstIconPath="/svg/lock.svg" 
                secondIconPathBefore="/svg/eye.svg" 
                secondIconPathAfter="/svg/eye-slash.svg" 
                placeholder="Пароль"
                @update="form.password = $event"
            />
            <div class="limit">
                Минимум 8 символов
            </div>
            <regInput
                id="password-retry"
                inputType="password" 
                firstIconPath="/svg/lock.svg" 
                secondIconPathBefore="/svg/eye.svg" 
                secondIconPathAfter="/svg/eye-slash.svg" 
                placeholder="Подтвердите пароль"
                @update="form.password_confirmation = $event"
            />
            <div class="agreenment">
                <input type="checkbox" name="checkbox" id="checkbox" v-model="agreement">
                <label for="checkbox">Я согласен на обработку моих персональных данных в соответствии с <router-link to="/" class="conditions">Условиями</router-link></label>
            </div>
        </div>
        <div class="enter">
            <UButton
                variant="primary"
                size="medium"
                :action="agreement? 'normal' : 'disabled'"
                text="Зарегистироваться"
                class="enter__button"
                @click="registration"
            />
            <div class="enter__description">
                У вас уже есть аккаунт? <router-link to="/login" class="forget">Вход</router-link>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.register-wrapper {
    width: 624px;
    height: 100%;
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    background-color: #fff;
    border-radius: 24px;
}

.inputs {
    display: flex;
    flex-direction: column;
    gap: 16px;

    &__row {
        display: flex;
        gap: 16px;
    }
}

.forget {
    font-weight: 400;
    font-size: 14px;
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
.limit{
    font-weight: 400;
    font-size: 14px;
    color: #6A6E75;
}
.agreenment{
    display: flex;
    flex-direction: row;
    align-items: baseline;
    gap: 10px;

    & label{
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;

        & .conditions{
            text-decoration: underline;
            cursor: pointer;
        }
    }
}
</style>