# Mottu - Mapeamento Inteligente de Pátios

Um sistema de gerenciamento de pátio para controle e organização de motocicletas da Mottu, desenvolvido com React Native e Expo como parte de um projeto acadêmico.

---

## 📱 Sobre o Projeto

O **Mottu - Mapeamento Inteligente de Pátios** é um protótipo funcional de aplicativo mobile que permite o gerenciamento eficiente de motocicletas em pátios. O app oferece funcionalidades como dashboard, histórico de ações, filtros, leitura de QR Code e um sistema de autenticação, com persistência de dados via API.

### Principais Funcionalidades

- **Autenticação de Usuário**: Telas de Login e Registro com comunicação com a API.
- **Persistência de Tema**: O tema (claro/escuro) escolhido pelo usuário é salvo e restaurado no login.
- **Cadastro de Motos**: Formulário controlado com validação, preenchimento automático via QR Code e armazenamento local.
- **Mapa do Pátio**: Visualização em grid das motos posicionadas, com filtros por status/modelo e interação para posicionar/remover motos.
- **Dashboard**: Exibe métricas, gráficos e eficiência do pátio em tempo real.
- **Histórico**: Registro de todas as ações realizadas no app, com opção de limpar histórico.
- **Armazenamento Local**: Dados de sessão e do pátio são persistidos usando AsyncStorage.

---

## 🚀 Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento de aplicativos móveis.
- **Expo**: Plataforma para facilitar o desenvolvimento e build de apps React Native.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **Expo Router**: Sistema de navegação baseado em arquivos.
- **AsyncStorage**: Armazenamento local persistente no dispositivo.
- **Expo Camera**: Leitura de QR Code para cadastro rápido.
- **Lucide Icons**: Biblioteca de ícones moderna e leve.

---

## 📋 Pré-requisitos

- **Node.js**: Versão 18 ou superior.
- **npm** ou **yarn**: Gerenciador de pacotes.
- **Expo CLI**: `npm install -g expo-cli`.
- **Git**: Para clonar o repositório.

---

## 🔧 Instalação e Execução

1.  **Clone o repositório:**
    ```sh
    git clone <url-do-repositorio>
    cd mottu_mobile_app
    ```

2.  **Instale as dependências:**
    ```sh
    npm install
    ```

3.  **Configure a API:**
    -   Abra o arquivo `src/api/config.ts`.
    -   Altere a constante `API_BASE_URL` para a URL do seu backend Java.
    ```typescript
    // src/api/config.ts
    export const API_BASE_URL = 'https://sua-api-aqui.com/api/v1';
    ```

4.  **Inicie o projeto com Expo:**
    ```sh
    npx expo start
    ```

5.  **Abra o app:**
    -   Use o aplicativo **Expo Go** no seu celular para escanear o QR Code.
    -   Ou rode em um emulador Android (`a`) ou iOS (`i`).

---

## 🏗️ Estrutura do Projeto

O projeto foi reorganizado para melhorar a escalabilidade e a separação de responsabilidades.

```
mottu_mobile_app/
├── app/                # Telas e navegação (Expo Router)
├── src/
│   ├── api/            # Lógica de comunicação com a API
│   │   ├── authService.ts
│   │   └── config.ts
│   ├── components/     # Componentes React reutilizáveis
│   ├── constants/      # Constantes globais (status, modelos)
│   ├── context/        # Contextos React (Auth, Theme)
│   ├── hooks/          # Hooks customizados (useStorage, useLogout)
│   ├── theme/          # Definições de tema e cores
│   └── types/          # Interfaces e tipos TypeScript
└── ...
```

---

## 🔌 Endpoints da API (Esperados)

O aplicativo está configurado para interagir com os seguintes endpoints. Adapte seu backend Java para corresponder a esta estrutura.

### Autenticação
*   `GET /users?email={email}`: Usado para verificar se um usuário existe e para o processo de login (mock).
*   `POST /users`: Usado para registrar um novo usuário.

> **Nota:** Para um backend real, é recomendado usar `POST /auth/login` e `POST /auth/register` com envio de senha no corpo da requisição, e não como query param. A estrutura atual reflete a limitação do `mockapi.io`.

### Motocicletas
*   Atualmente, o CRUD de motocicletas é gerenciado localmente via `AsyncStorage` no hook `useMotorcycleStorage`. A integração com a API para motos pode ser o próximo passo.

---

## 📝 Notas de Uso

- **Login**: Como a API é um mock, o login verifica se o email existe e se a senha corresponde à cadastrada.
- **QR Code**: Para testar, gere um QR Code com um JSON no seguinte formato:
  ```json
  {"placa": "XYZ1234", "modelo": "Mottu Sport", "cor": "Preta", "status": "Em manutenção"}
  ```

- **Dados Locais**: O estado do pátio (motos, grid) é salvo localmente. A ação "Resetar App" no menu de perfil limpa todos os dados locais.
