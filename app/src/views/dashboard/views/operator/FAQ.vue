<script setup></script>
<template>
  <div class="tab-content" id="faq-tab">
    <div class="profile-section max800">
      <div class="faq-question-text">Какие маршруты паломничества вы предлагаете?</div>
      <div class="faq-answer">
        <p>
          Мы предлагаем разнообразные маршруты по святым местам России и мира. У нас есть как
          короткие поездки, так и более длительные туры, которые включают посещение святых мест в
          Израиле, Турции, Греции, Египте и других странах. Вы можете выбрать маршрут в зависимости
          от ваших интересов и предпочтений.
        </p>
      </div>
    </div>
    <div class="profile-section max800">
      <div class="faq-question-text">Как забронировать паломничество?</div>
      <div class="faq-answer">
        <p>
          Для бронирования паломничества вам нужно связаться с нами через сайт, по телефону или по
          электронной почте. Менеджер нашей службы поможет выбрать подходящий маршрут, обсудит все
          детали и оформит заявку. Также можно заполнить онлайн-форму на нашем сайте, и мы свяжемся
          с вами в течение рабочего дня.
        </p>
      </div>
    </div>
    <div class="profile-section max800">
      <div class="faq-question-text">Что включено в стоимость паломничества?</div>
      <div class="faq-answer">
        <p>
          В стоимость паломничества обычно входит транспорт, проживание, питание, экскурсии по
          святым местам, услуги гида, визовая поддержка (если требуется) и медицинская страховка.
          Конкретные условия могут варьироваться в зависимости от маршрута, и все детали можно
          уточнить у нашего менеджера.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tab-content {
  height: 100%;
  width: 100%;
  padding: 24px 0;
  background-color: #f1f1f4;
}
.profile-section {
  padding: 24px 32px;
  background-color: #fff;
  border-radius: 16px;
}
.max800 {
  max-width: 800px;
  display: table;
  margin: 0 auto;
  margin-bottom: 16px !important;
}

.faq-question-text {
  font-weight: 500;
  font-style: Medium;
  font-size: 20px;
  margin-bottom: 20px;
  line-height: 28px;
  color: rgba(53, 53, 53, 1);
}

.faq-answer {
  color: rgba(106, 110, 117, 1);
  font-weight: 400;
  font-style: Regular;
  font-size: 16px;
  line-height: 24px;
}
</style>
