<template>
    <div class="layout-wrapper">
        <header class="header">
            <div class="header__info">
                <div class="header__logo"><img src="/logo.png" alt="logo"></div>
            </div>
            <div class="header__help">Помощь</div>
        </header>
        <main class="main">
            <router-view />
        </main>
        <footer class="footer">
            <div class="footer__left">2025 @ АНО "Паломнический центр"</div>
            <div class="footer__right"><div>Публичная оферта</div> | <div>Политика конфиденциальности</div></div>
        </footer>
    </div>
</template>

<style lang="scss" scoped>
.layout-wrapper {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-family: 'Inter', sans-serif;
    background-color: #f1f1f4;
}
.header, .footer {
    padding: 24px 42px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &__info {
        display: flex;
        align-items: center;
        gap: 16px;        
    }
}
.header {
    padding-bottom: 0;
    background-color: inherit;

    &__logo img{
        height: 60px;
    }

    &__help {
        font-weight: 500;
        font-style: Medium;
        font-size: 16px;
        text-decoration: underline;
        color: #1D1D26;
    }
}
.main {
    margin: 0 auto;
}
.footer {
    padding-top: 0;
    background-color: inherit;

    &__left {
        font-weight: 400;
        font-style: Regular;
        font-size: 14px;
        color: #768187;
    }

    &__right {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        font-weight: 400;
        font-style: Regular;
        font-size: 14px;
        text-decoration: underline;
        color: #1D1D26;
    }
}
</style>
