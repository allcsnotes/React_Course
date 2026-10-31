import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import './i18n';

const names = { en: 'English', de: 'Deutsch', hi: 'हिन्दी', ar: 'العربية' };

export default function App() {
  const { t, i18n } = useTranslation();
  return (
    <View style={styles.page}>
      <View style={styles.bar}>
        <Text style={styles.logo}>allcsvideos</Text>
        <View style={styles.langs}>
          {Object.entries(names).map(([code, name]) => (
            <Pressable key={code} onPress={() => i18n.changeLanguage(code)}>
              <Text style={[styles.lang, code === i18n.language && styles.on]}>{name}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <Text style={styles.hello}>{t('greeting', { name: 'Priya' })}</Text>
      <Text style={styles.h1}>{t('hero')}</Text>
      <View style={styles.card}>
        <Text style={styles.h2}>{t('course')}</Text>
        <Text style={styles.line}>{t('lessons', { count: 24 })}</Text>
        <Text style={styles.line}>{t('price', { amount: 39.5 })}</Text>
        <Pressable style={styles.button} onPress={() => console.log(t('enroll'))}>
          <Text style={styles.buttonText}>{t('enroll')}</Text>
        </Pressable>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
  },
  h2: {
    fontSize: 26,
    fontWeight: '700',
    color: '#14213d',
    marginBottom: 8,
  },
  line: { fontSize: 22, color: '#14213d', marginBottom: 6 },
  button: {
    backgroundColor: '#1a7cff',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 22,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  buttonText: { fontSize: 22, fontWeight: '700', color: '#fff' },
  page: { flex: 1, backgroundColor: '#f3f5f9', paddingTop: 12, paddingHorizontal: 32 },
  bar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  logo: { fontSize: 20, fontWeight: '700', color: '#1a7cff' },
  langs: { flexDirection: 'row', gap: 18 },
  lang: { fontSize: 18, fontWeight: '600', color: '#5b6577' },
  on: { color: '#1a7cff' },
  hello: { fontSize: 20, color: '#5b6577' },
  h1: { fontSize: 38, fontWeight: '700', color: '#14213d', marginBottom: 10 },
});
