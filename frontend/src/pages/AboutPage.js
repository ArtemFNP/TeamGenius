// src/pages/AboutPage.js
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// --- MUI Imports ---
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles'; // Для кастомного стилизованного компонента, если нужно
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; // Иконка для стрелок

// --- Local Imports ---
import clothesPhotoImg from '../assets/images/clothesPhoto.png'; // Убедитесь, что путь правильный
import purpleClockImg from '../assets/images/PurpleClock.png';   // Убедитесь, что путь правильный

// Если вы хотите использовать MUI 'styled' API для более комплексных стилей
// или чтобы избежать повторяющихся sx пропсов для одинаковых элементов
const StyledSectionBox = styled(Box)(({ theme }) => ({
  border: '1px solid rgba(255, 255, 255, 0.1)', // Тонкая белая рамка для секций
  borderRadius: '25px', // Заокругление углов
  padding: '40px',
  marginBottom: '50px',
  backgroundColor: 'rgba(0,0,0,0.15)', // Чуть прозрачный фон
  backdropFilter: 'blur(5px)', // Эффект размытия, если фон не однородный
  boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)', // Тень
  display: 'flex',
  flexDirection: 'row', // По умолчанию в строку
  alignItems: 'flex-start',
  gap: '40px',
  // Медиа-запрос для колонок
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column', // На мобильных в колонку
    alignItems: 'center',
    textAlign: 'center',
    padding: '20px'
  }
}));

const AboutPage = () => {
  const { t } = useLanguage();

  return (
    // Обертка для всей страницы, будет внутри .app-main-content
    // Используем sx для стилизации вместо отдельного CSS файла
    <Box sx={{
      py: 5, // padding-top и padding-bottom 5*8 = 40px
      px: { xs: 2, md: 5 }, // padding-left и padding-right
      minHeight: 'calc(100vh - var(--navbar-height) - var(--footer-height) - var(--app-main-content-padding-vertical))', // Для sticky footer
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: 'var(--navbar-text-color)', // Цвет текста из переменных
      fontFamily: 'var(--font-primary)',
    }}>
      {/* --- HERO SECTION --- */}
      <Grid container spacing={4} alignItems="center" sx={{ mb: 10, maxWidth: '1200px', width: '100%' }}>
        {/* Left Content */}
        <Grid item xs={12} md={6}>
          <Typography variant="h3" component="h1" sx={{ 
            fontWeight: 'bold', 
            mb: 3, 
            color: 'white', // Яркий белый цвет для заголовка
            textAlign: { xs: 'center', md: 'left' } 
          }}>
            {t('aboutPageTitle')}
          </Typography>
          <Typography variant="body1" sx={{ 
            mb: 4, 
            lineHeight: 1.6, 
            color: 'var(--navbar-text-color)', // Используем переменную для текста
            textAlign: { xs: 'center', md: 'left' } 
          }}>
            {t('aboutHeroDescription')}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: { xs: 'center', md: 'flex-start' } 
          }}>
            <Button variant="contained" sx={{ 
              backgroundColor: 'var(--button-primary-bg)', 
              color: 'var(--button-primary-text)', 
              borderRadius: '12px', 
              px: 4, 
              py: 1.5,
              textTransform: 'none', // Отключить uppercase
              '&:hover': {
                backgroundColor: 'rgba(125, 100, 225, 0.8)', // Более светлый оттенок при наведении
              }
            }}>
              {t('downloadNow')}
            </Button>
            <Button variant="outlined" sx={{ 
              borderColor: 'var(--button-primary-bg)', 
              color: 'var(--button-primary-bg)', 
              borderRadius: '12px', 
              px: 4, 
              py: 1.5,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(125, 100, 225, 0.1)', // Легкий фон при наведении
              }
            }}>
              {t('learnMore')}
            </Button>
          </Box>
        </Grid>
        {/* Right Image */}
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box 
            component="img" 
            src={purpleClockImg} 
            alt="Digital Duration Concept" 
            sx={{ 
              maxWidth: '100%', 
              height: 'auto', 
              // Настройка тени для изображения
              filter: 'drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.4))'
            }} 
          />
        </Grid>
      </Grid>

      {/* --- INTRODUCTION SECTION --- */}
      <StyledSectionBox sx={{ maxWidth: '1200px', width: '100%' }}>
        <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            {t('introductionToSmartStyle')}
          </Typography>
          <ArrowForwardIcon sx={{ color: 'var(--navbar-text-color)', fontSize: '2rem' }} />
        </Box>
        <Typography variant="body1" sx={{ flexGrow: 1, color: 'var(--main-block-text-secondary)' }}>
          {t('introSmartStyleContent')}
        </Typography>
        <Box 
            component="img" 
            src={clothesPhotoImg} 
            alt="Clothes for Smart Style" 
            sx={{ 
                maxWidth: { xs: '100%', md: '250px' }, // Размер изображения
                height: 'auto',
                ml: { md: 5 }, // Отступ слева на десктопе
                display: { xs: 'none', md: 'block' } // Скрыть на мобильных, показать на десктопе
            }} 
        />
      </StyledSectionBox>

      {/* --- ABOUT / OUR VISION SECTION --- */}
      <StyledSectionBox sx={{ maxWidth: '1200px', width: '100%' }}>
        <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            {t('ourVisionForSmartStyle')}
          </Typography>
          <Button variant="contained" sx={{ 
            backgroundColor: 'var(--button-primary-bg)', 
            color: 'var(--button-primary-text)', 
            borderRadius: '12px', 
            px: 3, 
            py: 1, 
            mt: 2, 
            textTransform: 'none' 
          }}>
            {t('letsGetInTouch')}
          </Button>
        </Box>
        <Typography variant="body1" sx={{ flexGrow: 1, color: 'var(--main-block-text-secondary)' }}>
          {t('ourVisionContent')}
        </Typography>
      </StyledSectionBox>

      {/* --- WHY USE / WHY CHOOSE SECTION --- */}
      <StyledSectionBox sx={{ maxWidth: '1200px', width: '100%' }}>
        <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            {t('whyChooseSmartStyle')}
          </Typography>
          <ArrowForwardIcon sx={{ color: 'var(--navbar-text-color)', fontSize: '2rem' }} />
        </Box>
        <Typography variant="body1" sx={{ flexGrow: 1, color: 'var(--main-block-text-secondary)' }}>
          {t('whyChooseContent')}
        </Typography>
      </StyledSectionBox>

      {/* --- WHY IT IS NOT FREE / OUR TECHNOLOGY SECTION --- */}
      <StyledSectionBox sx={{ maxWidth: '1200px', width: '100%', mb: 5 }}>
        <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            {t('ourTechnology')}
          </Typography>
          <ArrowForwardIcon sx={{ color: 'var(--navbar-text-color)', fontSize: '2rem' }} />
        </Box>
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
          <Typography variant="body1" sx={{ mb: 3, color: 'var(--main-block-text-secondary)', textAlign: { xs: 'center', md: 'left' } }}>
            {t('ourTechnologyContent')}
          </Typography>
          <Button variant="contained" sx={{ 
            backgroundColor: 'var(--button-primary-bg)', 
            color: 'var(--button-primary-text)', 
            borderRadius: '12px', 
            px: 4, 
            py: 1.5,
            textTransform: 'none'
          }}>
            {t('visitOurWebsite')}
          </Button>
        </Box>
      </StyledSectionBox>

    </Box>
  );
};

export default AboutPage;