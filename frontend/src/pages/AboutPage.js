// src/pages/AboutPage.js
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom'; // Потрібно для кнопки-посилання

// --- MUI Imports ---
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// --- Local Imports ---
import clothesPhotoImg from '../assets/images/clothesPhoto.png';
import purpleClockImg from '../assets/images/PurpleClock.png';

// Твій кастомний компонент, який ми зберігаємо
const StyledSectionBox = styled(Box)(({ theme }) => ({
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '25px',
  padding: '40px',
  marginBottom: '50px',
  backgroundColor: 'rgba(0,0,0,0.15)',
  backdropFilter: 'blur(5px)',
  boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: '40px',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '20px'
  }
}));

const AboutPage = () => {
  const { t } = useLanguage();

  return (
    <Box sx={{
      py: 5,
      px: { xs: 2, md: 5 },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: 'var(--navbar-text-color)',
      fontFamily: 'var(--font-primary)',
    }}>
      {/* --- HERO SECTION --- */}
      <Grid container spacing={4} alignItems="center" sx={{ mb: 10, maxWidth: '1200px', width: '100%' }}>
        {/* Left Content */}
        <Grid item xs={12} md={6}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 3, color: 'white', textAlign: { xs: 'center', md: 'left' } }}>
            {t('aboutPageTitle')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.6, color: 'var(--navbar-text-color)', textAlign: { xs: 'center', md: 'left' } }}>
            {t('aboutHeroDescription')}
          </Typography>
          {/* КНОПКИ ТУТ ВИДАЛЕНІ */}
        </Grid>
        {/* Right Image */}
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box 
            component="img" 
            src={purpleClockImg} 
            alt="Digital Duration Concept" 
            sx={{ maxWidth: '100%', height: 'auto', filter: 'drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.4))' }} 
          />
        </Grid>
      </Grid>

      {/* --- INTRODUCTION SECTION (ЗМІНЕНА СТРУКТУРА) --- */}
      <StyledSectionBox sx={{ maxWidth: '1200px', width: '100%' }}>
        {/* ЗОБРАЖЕННЯ ЗЛІВА */}
        <Box 
            component="img" 
            src={clothesPhotoImg} 
            alt="Clothes for Smart Style" 
            sx={{ 
                maxWidth: { xs: '80%', md: '250px' },
                height: 'auto',
                display: { xs: 'none', md: 'block' } // Сховати на мобілках для кращого вигляду
            }} 
        />
        {/* КОНТЕНТ СПРАВА */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {t('introductionToSmartStyle')}
                </Typography>
                <ArrowForwardIcon sx={{ color: 'var(--navbar-text-color)', fontSize: '2rem' }} />
            </Box>
            <Typography variant="body1" sx={{ color: 'var(--main-block-text-secondary)' }}>
                {t('introSmartStyleContent')}
            </Typography>
        </Box>
      </StyledSectionBox>

      {/* --- ABOUT / OUR VISION SECTION --- */}
      <StyledSectionBox sx={{ maxWidth: '1200px', width: '100%' }}>
        <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            {t('ourVisionForSmartStyle')}
          </Typography>
          {/* КНОПКА ТУТ ВИДАЛЕНА */}
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

      {/* --- OUR TECHNOLOGY SECTION --- */}
      <StyledSectionBox sx={{ maxWidth: '1200px', width: '100%', mb: 5 }}>
        <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            {t('ourTechnology')}
          </Typography>
          <ArrowForwardIcon sx={{ color: 'var(--navbar-text-color)', fontSize: '2rem' }} />
        </Box>
        <Typography variant="body1" sx={{ flexGrow: 1, color: 'var(--main-block-text-secondary)' }}>
          {t('ourTechnologyContent')}
        </Typography>
        {/* КНОПКА ТУТ ВИДАЛЕНА */}
      </StyledSectionBox>

      {/* --- ФІНАЛЬНА КНОПКА "VISIT OUR WEBSITE" --- */}
      <Button 
        variant="contained" 
        component={Link}
        to="/"
        sx={{ 
          backgroundColor: 'var(--button-primary-bg)', 
          color: 'var(--button-primary-text)', 
          borderRadius: '12px', 
          px: 4, 
          py: 1.5,
          textTransform: 'none',
          fontSize: '1rem',
          mb: 5, // Відступ знизу
          '&:hover': {
            backgroundColor: 'rgba(125, 100, 225, 0.8)',
          }
        }}>
        {t('visitOurWebsite')}
      </Button>

    </Box>
  );
};

export default AboutPage;