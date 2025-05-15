# Aplicativo de Gerenciamento de Pátios da Mottu

Aplicativo mobile em React Native (com Expo) para o mapeamento inteligente de motos nos pátios da Mottu, integrando visão computacional, IoT e gestão visual.

## Funcionalidades Principais

- **Cadastro Rápido:** Escaneamento de placas e formulário para cadastro rápido de motos
- **Mapa do Pátio:** Visualização 2D das motos posicionadas com código de cores por status
- **Dashboard:** Métricas operacionais e heatmap de ocupação
- **Sistema de Filtros:** Filtrar motos por status e visualizar em tempo real
- **Operação Offline:** Funcionalidade básica sem internet, sincronização quando online

## Tecnologias Utilizadas

- React Native com Expo SDK 52
- Expo Router 4 para navegação
- AsyncStorage para armazenamento local
- Zustand para gerenciamento de estado
- Expo Camera para leitura de placas
- Lucide Icons para ícones consistentes

## Instalação e Execução

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute o projeto:
   ```bash
   npm run dev
   ```

## Estrutura do Projeto

```
/app                    # Rotas da aplicação (Expo Router)
  /(tabs)               # Layout de abas do aplicativo  
    index.tsx           # Tela de Cadastro Rápido
    mapa.tsx            # Tela de Mapa do Pátio
    dashboard.tsx       # Tela de Dashboard Operacional
/components             # Componentes reutilizáveis
/constants              # Constantes globais, cores, etc.
/stores                 # Gerenciamento de estado (Zustand)
```

## Próximos Passos

- Integração com API backend real
- Implementação de reconhecimento de placas via ML
- Otimização para tablets à prova d'água
- Sistema de alertas e notificações em tempo real
- Expansão do dashboard com mais métricas e visualizações

## Licença

Todos os direitos reservados © Mottu 2023-2024.