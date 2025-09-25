# Mottu Challenge - Mapeamento Inteligente de Pátios

Aplicativo mobile para gerenciamento inteligente de pátios de motocicletas da Mottu, desenvolvido com React Native e Expo.

## 👥 Integrantes

- **Felipe Silva Maciel** - RM555307  
- **Eduardo Henrique Strapazzon Nagado** - RM558158  
- **Gustavo Ramires Lazzuri** - RM556772  

<<<<<<< HEAD
## 📱 Sobre o Projeto

Sistema completo para controle e organização de motocicletas em pátios, com integração em tempo real com backend API. Desenvolvido como protótipo funcional para gerenciamento eficiente do fluxo de motos.

### 🚀 Funcionalidades Principais

- **Autenticação Integrada**: Login e registro com validação de senha forte via API
- **Cadastro Inteligente**: Formulário controlado com validação e preenchimento automático via QR Code
- **Mapa do Pátio**: Visualização em grid interativa com posicionamento das motos
- **Dashboard em Tempo Real**: Métricas, gráficos e eficiência do pátio atualizados via API
- **Histórico de Ações**: Registro completo de todas as operações realizadas
- **Tema Personalizável**: Modo claro/escuro com persistência de preferências
- **Sincronização API**: Dados sincronizados com backend Java em tempo real

## 🛠️ Tecnologias Utilizadas

- **React Native** com **Expo** - Framework mobile
- **TypeScript** - Tipagem estática
- **Expo Router** - Navegação baseada em arquivos
- **AsyncStorage** - Persistência local
- **Expo Camera** - Leitura de QR Code
- **Integração API REST** - Comunicação com backend Java
- **Lucide Icons** - Biblioteca de ícones

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Git
- Backend Java configurado e rodando

## 🔧 Instalação e Configuração

1. **Clone o repositório:**
```bash
git clone https://github.com/fesilva2109/test_mobile_mottu.git
cd test_mobile_mottu
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure a URL da API:**
Verifique se as constantes `API_BASE` estão apontando para seu backend Java nos arquivos:
- `context/AuthContext.tsx`
- `hooks/useStorage.ts`

4. **Inicie o projeto:**
```bash
npx expo start
```

5. **Execute no dispositivo:**
- Use o app **Expo Go** para escanear o QR Code
- Ou rode em emulador Android (`a`) / iOS (`i`)

## 🏗️ Estrutura do Projeto

```
mottu_mobile_app/
├── app/                    # Telas e rotas
│   ├── (tabs)/            # Navegação por abas
│   │   ├── index.tsx      # Tela inicial
│   │   ├── cadastro.tsx   # Cadastro de motos
│   │   ├── mapa.tsx       # Mapa do pátio
│   │   ├── dashboard.tsx  # Estatísticas
│   │   └── historico.tsx  # Histórico
│   ├── login.tsx          # Autenticação
│   └── register.tsx       # Registro
├── components/            # Componentes reutilizáveis
│   ├── GridComponent.tsx  # Grid do pátio
│   ├── Logout.tsx         # Controle de sessão
│   └── ThemeToggle.tsx    # Alternância de tema
├── context/               # Gerenciamento de estado
│   ├── AuthContext.tsx    # Autenticação
│   ├── ThemeContext.tsx   # Tema
│   └── authService.ts     # Serviços de auth
├── hooks/                 # Hooks customizados
│   ├── useGridStorage.ts  # Gerenciamento do grid
│   └── useStorage.ts      # CRUD de motos
└── types/                 # Definições TypeScript
    └── index.ts           # Interfaces
```

## 🔌 Integração com API

### Endpoints Utilizados

**Autenticação:**
- `POST /auth/login` - Login de usuário
- `POST /auth/register` - Registro de novo usuário
- `POST /auth/logout` - Encerramento de sessão

**Gerenciamento de Motos:**
- `GET /motorcycles` - Listar todas as motos
- `POST /motorcycles` - Cadastrar nova moto
- `PUT /motorcycles/:id` - Atualizar moto existente
- `DELETE /motorcycles/:id` - Remover moto

### Formato dos Dados

**QR Code para cadastro rápido:**
```json
{
  "placa": "XYZ1234",
  "modelo": "Mottu Sport", 
  "cor": "Preta",
  "status": "Pronta para aluguel"
}
```

## 📊 Status das Motos

- 🟢 **Pronta para aluguel** - Disponível para uso
- 🟡 **Em manutenção** - Em serviço técnico
- 🔴 **Em quarentena** - Aguardando liberação
- ⚫ **Alta prioridade** - Necessidade urgente
- 🔵 **Reservada** - Alocada previamente
- ⚪ **Aguardando vistoria** - Inspeção pendente

## 🏍️ Modelos Suportados

- 🛵 **Mottu Pop** - Modelo popular
- 🏍️ **Mottu Sport** - Esportiva
- ⚡ **Mottu-E** - Elétrica

## 💡 Como Usar

### Login
- Utilize email válido e senha forte (8+ caracteres, maiúscula, minúscula, número)

### Cadastro de Motos
1. Acesse **Cadastrar**
2. Escolha entre:
   - Preenchimento manual do formulário
   - Leitura de QR Code com dados pré-definidos

### Mapa do Pátio
1. Navegue até **Mapa**
2. Visualize motos posicionadas no grid
3. Clique em células para posicionar/remover motos
4. Use filtros por status e modelo

### Dashboard
- Acompanhe métricas em tempo real:
  - Total de motos e disponíveis
  - Tempo médio no pátio
  - Eficiência de ocupação
  - Distribuição por status e modelo

## 🚀 Scripts de Desenvolvimento

```bash
npm start          # Inicia servidor Expo
npm run android    # Executa no Android
npm run ios        # Executa no iOS
npx eslint .       # Análise de código
```

## 📝 Notas Técnicas

- **Sincronização**: Dados atualizados em tempo real via API
- **Persistência**: Tema e preferências salvas localmente
- **Validação**: Formulários com feedback visual imediato
- **Performance**: Otimizado para dispositivos móveis

## 🤝 Contribuição

1. Faça fork do projeto
2. Crie branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -am 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra Pull Request

## 📞 Contato

Dúvidas ou sugestões? Entre em contato com a equipe pelo Teams ou email institucional.

---

**Desenvolvido como projeto acadêmico para a disciplina de Desenvolvimento Mobile**
=======
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
