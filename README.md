# Mottu - Mapeamento Inteligente de Pátios

Um sistema de gerenciamento de pátio para controle e organização de motocicletas da Mottu, desenvolvido com React Native e Expo.

---

## 👥 Integrantes

- **Felipe Silva Maciel** - RM555307  
- **Eduardo Henrique Strapazzon Nagado** - RM558158  
- **Gustavo Ramires Lazzuri** - RM556772  

---

## 📱 Sobre o Projeto

O **Mottu - Mapeamento Inteligente de Pátios** é um protótipo funcional de aplicativo mobile que permite o gerenciamento eficiente de motocicletas em pátios, simulando o uso de um sistema inteligente para cadastro, organização, visualização e controle das motos. O app oferece funcionalidades como dashboard, histórico de ações, filtros, leitura de QR Code e armazenamento local persistente.

### Principais Funcionalidades

- **Navegação entre telas**: Utiliza Expo Router, com pelo menos cinco rotas principais (Início, Mapa, Cadastro, Dashboard, Histórico).
- **Cadastro de motos**: Formulário controlado com validação, preenchimento automático via QR Code e armazenamento local.
- **Mapa do pátio**: Visualização em grid das motos posicionadas, com filtros por status/modelo e interação para posicionar/remover motos.
- **Dashboard**: Exibe métricas, gráficos e eficiência do pátio em tempo real.
- **Histórico**: Registro de todas as ações realizadas no app, com opção de limpar histórico.
- **Login/Logout**: Tela de autenticação simples e função de logout com limpeza de dados.
- **Armazenamento local**: Todos os dados são persistidos usando AsyncStorage, garantindo que as informações sejam mantidas mesmo após fechar o app.
- **Sistema de status e prioridades**: Controle visual e funcional de manutenção, quarentena, prioridade e reserva.

---

## 🚀 Tecnologias Utilizadas

- React Native
- Expo
- TypeScript
- AsyncStorage para persistência local
- Expo Camera para leitura de QR Code
- Lucide Icons para iconografia

---

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Git

---

## 🔧 Instalação e Execução

1. **Instale as dependências:**
   ```sh
   npm install
   ```

2. **Inicie o projeto com Expo:**
   ```sh
   npx expo start
   ```
   Ou, se preferir:
   ```sh
   expo start
   ```

3. **Abra o app:**
   - Use o aplicativo **Expo Go** no seu celular para escanear o QR Code exibido no terminal ou navegador.
   - Ou rode em um emulador Android/iOS.

---

## 📱 Como Usar

### Login
- Use qualquer email válido e senha que atenda aos requisitos:
  - Mínimo 8 caracteres
  - Uma letra maiúscula
  - Uma letra minúscula
  - Um número

### Cadastro de Motos
1. Acesse a aba "Cadastro"
2. Escolha entre:
   - Preenchimento manual do formulário
   - Leitura de QR Code

### Mapa do Pátio
1. Acesse a aba "Mapa"
2. Visualize todas as motos cadastradas
3. Clique em uma célula vazia para posicionar a moto selecionada
4. Use os filtros para encontrar motos específicas

### Dashboard
- Visualize métricas importantes:
  - Total de motos
  - Motos disponíveis
  - Tempo médio no pátio
  - Eficiência do pátio
  - Distribuição por status
  - Distribuição por modelo

### Histórico
- Veja todas as ações realizadas no app quando desejar.

---

## 📊 Status das Motos

- 🟢 Pronta para aluguel
- 🟡 Em manutenção
- 🔴 Em quarentena
- ⚫ Alta prioridade
- 🔵 Reservada
- ⚪ Aguardando vistoria

## 🏍️ Modelos Disponíveis

- 🛵 Mottu Pop
- 🏍️ Mottu Sport
- ⚡ Mottu-E

---

## 📝 Notas de Uso

- Os dados são armazenados localmente usando AsyncStorage.
- O sistema funciona offline após o primeiro carregamento.
- Recomenda-se fazer backup periódico dos dados.

---

## Contato

Dúvidas ou sugestões? Entre em contato com qualquer um dos integrantes pelo Teams ou e-mail institucional.
