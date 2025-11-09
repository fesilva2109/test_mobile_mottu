import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Github, Mail, Smartphone } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import Constants from 'expo-constants';

// Informações do app
const APP_INFO = {
  name: 'GEF - Mottu Challenge',
  version: Constants.expoConfig?.version || '1.0.0',
  commitHash: 'eed088d', 
  team: [
    'Felipe Silva Maciel - RM555307',
    'Eduardo Nagado - RM558158',
    'Gustavo Ramires Lazzuri - RM556772'
  ],
  technologies: [
    'React Native',
    'Expo',
    'TypeScript',
    'Firebase',
    'AsyncStorage',
    'Expo Router',
    'React Native Maps',
    'Expo Notifications'
  ]
};

export default function SobreScreen() {
  const router = useRouter();
  const { colors, t } = useTheme();

  const getStyles = (colors: any) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.neutral.lightGray,
    },
    header: {
      backgroundColor: colors.primary.main,
      padding: 24,
      paddingTop: 40,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      marginBottom: 24,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    backText: {
      color: colors.neutral.white,
      fontSize: 16,
      marginLeft: 8,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.neutral.white,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: colors.neutral.white,
      opacity: 0.9,
      textAlign: 'center',
      marginTop: 8,
    },
    content: {
      padding: 24,
    },
    section: {
      backgroundColor: colors.neutral.white,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.neutral.darkGray,
      marginBottom: 16,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral.lightGray,
    },
    infoLabel: {
      fontSize: 16,
      color: colors.neutral.gray,
      fontWeight: '500',
    },
    infoValue: {
      fontSize: 16,
      color: colors.neutral.darkGray,
      fontWeight: '600',
    },
    teamMember: {
      fontSize: 16,
      color: colors.neutral.darkGray,
      paddingVertical: 4,
    },
    technology: {
      backgroundColor: colors.primary.light,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      margin: 4,
    },
    technologyText: {
      color: colors.primary.main,
      fontSize: 14,
      fontWeight: '500',
    },
    technologiesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
    },
    contactSection: {
      marginTop: 24,
    },
    contactButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary.main,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
    },
    contactButtonText: {
      color: colors.neutral.white,
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 12,
    },
  });

  const styles = getStyles(colors);

  const handleEmailPress = () => {
    Linking.openURL('mailto:felipesilvaa.2109@gmail.com');
  };

  const handleGithubPress = () => {
    Linking.openURL('https://github.com/fesilva2109/test_mobile_mottu.git');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.neutral.white} />
          <Text style={styles.backText}>{t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('about.title')}</Text>
        <Text style={styles.subtitle}>{t('about.subtitle')}</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('about.appInfo')}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('about.appName')}</Text>
            <Text style={styles.infoValue}>{APP_INFO.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('about.version')}</Text>
            <Text style={styles.infoValue}>{APP_INFO.version}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('about.commitHash')}</Text>
            <Text style={styles.infoValue}>{APP_INFO.commitHash}</Text>
          </View>
        </View>

        {/* Team */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('about.team')}</Text>
          {APP_INFO.team.map((member, index) => (
            <Text key={index} style={styles.teamMember}>• {member}</Text>
          ))}
        </View>

        {/* Technologies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('about.technologies')}</Text>
          <View style={styles.technologiesContainer}>
            {APP_INFO.technologies.map((tech, index) => (
              <View key={index} style={styles.technology}>
                <Text style={styles.technologyText}>{tech}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contact */}
        <View style={styles.contactSection}>
          <TouchableOpacity style={styles.contactButton} onPress={handleEmailPress}>
            <Mail size={20} color={colors.neutral.white} />
            <Text style={styles.contactButtonText}>{t('about.contactProfessor')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactButton} onPress={handleGithubPress}>
            <Github size={20} color={colors.neutral.white} />
            <Text style={styles.contactButtonText}>{t('about.viewCode')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}