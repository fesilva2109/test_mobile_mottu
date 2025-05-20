# Mottu - Mapeamento Inteligente de Pátios

Um sistema de gerenciamento de pátio para controle e organização de motocicletas da Mottu, desenvolvido com React Native e Expo.

## 📱 Sobre o Projeto

O Mottu - Mapeamento Inteligente de Pátios é uma aplicação que permite o gerenciamento eficiente de motocicletas em pátios, oferecendo funcionalidades como:

- Cadastro de motocicletas via formulário ou QR Code
- Mapa interativo do pátio com posicionamento das motos
- Dashboard com métricas e KPIs importantes
- Sistema de status e prioridades
- Controle de manutenção e quarentena

## 🚀 Tecnologias Utilizadas

- React Native
- Expo
- TypeScript
- AsyncStorage para persistência local
- Expo Camera para leitura de QR Code
- Lucide Icons para iconografia

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o projeto:
```bash
npm run dev
```

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
3. Arraste e solte para organizar as motos no grid
4. Use os filtros para encontrar motos específicas

### Dashboard
- Visualize métricas importantes:
  - Total de motos
  - Motos disponíveis
  - Tempo médio no pátio
  - Eficiência do pátio
  - Distribuição por status
  - Distribuição por modelo

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

## 📝 Notas de Uso

- Os dados são armazenados localmente usando AsyncStorage
- O sistema funciona offline após o primeiro carregamento
- Recomenda-se fazer backup periódico dos dados

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
