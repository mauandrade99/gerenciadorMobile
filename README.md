# Gerenciador Mobile (React Native)

Este é um aplicativo móvel nativo para Android e iOS, construído com React Native e TypeScript. Ele serve como uma interface móvel para uma API REST de gerenciamento de usuários e endereços, portando a lógica de uma aplicação web React existente para uma experiência nativa.

## ✨ Funcionalidades

-   **Fluxo de Autenticação Nativo:** Telas de Login e Registro com gerenciamento de sessão persistente usando `AsyncStorage`.
-   **Navegação Fluida:** Transição entre telas gerenciada por React Navigation.
-   **Dashboard Interativo:**
    -   **Visão de Administrador:** Gerenciamento de usuários e seus endereços.
    -   **Visão de Usuário Comum:** Foco no gerenciamento dos próprios endereços.
-   **CRUDs com Modais Nativos:** Funcionalidades completas de Criar, Ler, Atualizar e Excluir para usuários e endereços, utilizando modais nativos.
-   **Busca de CEP em Tempo Real:** Formulário de endereço com preenchimento automático via API ViaCEP.
-   **Componentes Nativos:** A interface utiliza componentes que são traduzidos para elementos de UI nativos do Android e iOS, garantindo performance e uma experiência de usuário autêntica.
-   **Estilização Centralizada:** Um tema de estilos global garante consistência visual em todo o aplicativo.

## 🛠️ Stack de Tecnologias

-   **Framework:** [React Native](https://reactnative.dev/)
-   **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
-   **Navegação:** [React Navigation](https://reactnavigation.org/)
-   **Cliente HTTP:** [Axios](https://axios-http.com/)
-   **Gerenciamento de Estado:** React Context API e Hooks.
-   **Armazenamento Local:** [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)
-   **Componentes de UI:**
    -   Componentes Nativos do React Native (`View`, `Text`, `Pressable`, etc.).
    -   [@react-native-picker/picker](https://github.com/react-native-picker/picker) para selects.
-   **Ícones:** [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons) (FontAwesome 5)
-   **Gerenciamento de Variáveis de Ambiente:** [react-native-dotenv](https://github.com/zetachang/react-native-dotenv)

## 📦 Dependências Adicionadas

Abaixo estão os comandos para instalar todas as dependências que foram adicionadas ao projeto.

```bash
# Navegação
npm install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context

# Lógica e Requisições
npm install axios jwt-decode

# Armazenamento e Configuração
npm install @react-native-async-storage/async-storage react-native-dotenv

# Componentes e Ícones
npm install react-native-vector-icons @react-native-picker/picker

# Tipos para TypeScript (Desenvolvimento)
npm install --save-dev @types/react-native-vector-icons
```

## 🚀 Como Executar o Projeto

### Pré-requisitos

-   Ambiente de desenvolvimento React Native configurado para Android. Siga o [guia oficial](https://reactnative.dev/docs/environment-setup?guide=native) (React Native CLI Quickstart).
-   Node.js, JDK 17, Android Studio e um Emulador Android configurado.
-   Uma instância da API backend correspondente rodando e acessível.

### 1. Clonar o Repositório

```bash
git clone https://github.com/mauandrade99/GerenciadorMobile
cd GerenciadorMobile
```

### 2. Instalar as Dependências

```bash
npm install
```

### 3. Configurar as Variáveis de Ambiente

Crie um arquivo chamado `.env` na raiz do projeto e adicione a URL da sua API backend.

```env
# Exemplo de configuração do .env
API_URL=https://vpsw2882.publiccloud.com.br/fullstack
```

### 4. Executar o Servidor Metro

O Metro é o bundler do React Native. Ele precisa estar rodando em um terminal separado.

```bash
npm start
```

### 5. Executar a Aplicação no Emulador/Dispositivo

Com o servidor Metro rodando, abra um **novo terminal** e execute o seguinte comando para compilar e instalar o app no seu emulador ou dispositivo Android conectado.

```bash
npm run android
```

## 📲 Como Gerar um APK para Testes (Debug)

Após executar `npm run android` com sucesso pelo menos uma vez, um APK de debug é gerado automaticamente. Você pode encontrá-lo no seguinte caminho:

`android/app/build/outputs/apk/debug/app-debug.apk`

Você pode pegar este arquivo e instalá-lo em qualquer dispositivo Android para testes. Lembre-se que este APK de debug ainda precisa se conectar ao servidor Metro para funcionar.

## 릴 Como Gerar um APK de Produção (Release)

Para gerar um APK que pode ser distribuído e não depende do servidor de desenvolvimento, siga os passos da documentação oficial do React Native para [publicar em Android](https://reactnative.dev/docs/signed-apk-android). O processo geral envolve:

1.  Gerar uma chave de assinatura (keystore).
2.  Configurar o Gradle para usar essa chave.
3.  Executar o comando de build para release.

No terminal, dentro da pasta `android`, execute:

```bash
# Limpa builds antigos (opcional, mas recomendado)
./gradlew.bat clean

# Gera o APK de release
./gradlew.bat assembleRelease
```

O APK de produção assinado estará localizado em:

`android/app/build/outputs/apk/release/app-release.apk`
