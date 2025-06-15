import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3b0066', // Ваш основной фиолетовый цвет для AppBar
    },
    secondary: {
      main: '#4e008c', // Дополнительный фиолетовый для Drawer
    },
    text: {
      primary: '#ffffff', // Белый текст по умолчанию
    },
    // Добавьте другие цвета, если нужно
  },
  typography: {
    fontFamily: 'Roboto, sans-serif', // Укажите ваш шрифт, если не Roboto
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Убрать капитализацию текста кнопок
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          // Если хотите жестко задать высоту AppBar
          // minHeight: '64px', 
        },
      },
    },
    // Добавьте другие переопределения стилей компонентов, если нужно
  }
});

export default theme;