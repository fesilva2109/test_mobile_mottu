# GEF Mottu Challenge - Mapeamento Inteligente de Pátios

Aplicativo mobile para gerenciamento inteligente de pátios de motocicletas da Mottu, desenvolvido com React Native e Expo.

## 👥 Integrantes

- **[Felipe Silva Maciel](https://github.com/fesilva2109)** - RM555307  
- **[Eduardo Henrique Strapazzon Nagado](https://github.com/EduNagado)** - RM558158  
- **[Gustavo Ramires Lazzuri](https://github.com/guLazzuri)** - RM556772  

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
- Backend Java configurado

## 🔧 Instalação e Configuração

1. **Clone o repositório:**
```bash
git clone https://github.com/fesilva2109/test_mobile_mottu.git
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure a URL da API:**
Verifique se as constantes `API_BASE` estão apontando para seu backend Java nos arquivos:
- `context/api.ts` (ou `context/config.ts` se a URL estiver lá)

4. **Inicie o projeto:**
```bash
npx expo start
```

5. **Execute no dispositivo:**
- Use o app **Expo Go** para escanear o QR Code
- Ou rode em emulador Android (`a`) / iOS (`i`)

## 🏗️ Estrutura do Projeto

```
test_mobile_mottu/
│
├── app/ 
│   ├── (tabs)/ 
│   │   ├── _layout.tsx         # Define o layout das abas.
│   │   ├── index.tsx           # Tela principal (Home) do app.
│   │   ├── cadastro.tsx        # Tela para cadastrar ou editar motocicletas.
│   │   ├── dashboard.tsx       # Tela com gráficos e métricas do pátio.
│   │   └── mapa.tsx            # Tela com a visualização do mapa do pátio.
│   │
│   ├── _layout.tsx             # Layout raiz da aplicação. Envolve todas as telas com os provedores de contexto.
│   ├── login.tsx               # Tela de Login para autenticação do usuário.
│   ├── register.tsx            # Tela de Registro para novos usuários.
│   ├── historico.tsx           # Tela que exibe o histórico de ações realizadas no app.
│   ├── sobre.tsx               # Tela "Sobre", com informações do app, equipe e tecnologias.
│   └── +not-found.tsx          # Tela de erro 404, exibida quando uma rota não é encontrada.
│
├── assets/
│   └── images/
│       └── icon.png            # Ícone principal do aplicativo.
│
├── components/ 
│   ├── DashboardCard.tsx       # Card para exibir uma métrica no dashboard.
│   ├── FilterMenu.tsx          # Menu de filtros para o mapa.
│   ├── GridComponent.tsx       # Componente que renderiza o grid do pátio.
│   ├── MotoCard.tsx            # Card para exibir informações de uma moto.
│   ├── MotoList.tsx            # Lista de motocicletas.
│   ├── OfflineBanner.tsx       # Banner que informa o usuário quando o app está offline.
│   ├── StatusChart.tsx         # Gráfico de pizza para o status das motos.
│   └── ThemeToggle.tsx         # Botão para alternar entre tema claro e escuro.
│
├── context/
│   ├── AuthContext.tsx         # Gerencia o estado de autenticação.
│   ├── authService.ts          # Contém a lógica para fazer as chamadas de API de autenticação.
│   ├── ApiStatusContext.tsx    # Gerencia o estado da conexão com a API.
│   ├── apiErrorHandler.ts      # Função utilitária para tratar erros de API de forma centralizada.
│   ├── ThemeContext.tsx        # Gerencia o tema da aplicação.
│   ├── NotificationContext.tsx # Gerencia o envio e recebimento de notificações.
│   └── api.ts                  # Configuração da instância do Axios para chamadas à API.
│
├── hooks/ 
│   ├── useMotorcycleStorage.ts # Hook para gerenciar o CRUD de motocicletas.
│   └── useFrameworkReady.ts    # Hook para garantir que as fontes e outros recursos estejam carregados.
│
├── i18n/
│   ├── index.ts                # Configuração inicial do i18next.
│   ├── pt.json                 # Traduções para o Português.
│   └── es.json                 # Traduções para o Espanhol.
│
├── types/
│   └── index.ts                # Tipos globais da aplicação (User, Motorcycle, etc.).
│
├── .gitignore                  # Arquivo que especifica arquivos e pastas a serem ignorados pelo Git.
├── app.json                    # Arquivo de configuração principal do Expo.
├── eas.json                    # Arquivo de configuração do Expo Application Services (EAS) para builds.
├── package.json                # Define os metadados do projeto e as dependências.
├── README.md                   # Documentação principal do projeto.
└── tsconfig.json               # Arquivo de configuração do TypeScript.

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
![Imagem do WhatsApp de 2025-11-03 à(s) 22 05 06_b0db6cf2](https://github.com/user-attachments/assets/909ba808-4554-47a5-9719-081d5df4692f)

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
