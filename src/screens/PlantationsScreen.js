import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SPACING, SHADOW } from '../theme';
import { useApp } from '../context/AppContext';
import PlantationCard from '../components/PlantationCard';
import Icon from '../components/LucideIcon';

const FILTERS = [
  { key: 'all',      label: 'Toutes' },
  { key: 'faible',   label: 'Faible'   },
  { key: 'modere',   label: 'Modéré'   },
  { key: 'eleve',    label: 'Élevé'    },
  { key: 'critique', label: 'Critique' },
];

export default function PlantationsScreen({ navigation }) {
  const { plantations } = useApp();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = plantations.filter(p => {
    const matchFilter = filter === 'all' || p.riskLevel === filter;
    const q = search.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) || p.region.toLowerCase().includes(q) || p.cropLabel.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mes cultures</Text>
          <Text style={styles.sub}>{plantations.length} plantation{plantations.length > 1 ? 's' : ''}</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddPlantation')}
        >
          <Icon name="Plus" size={16} color={COLORS.brand} strokeWidth={2.5} />
          <Text style={styles.addBtnText}>Ajouter</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Icon name="Search" size={16} color={COLORS.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={COLORS.textMuted}
        />
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* List */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Icon name="Leaf" size={40} color={COLORS.border} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>Aucune culture</Text>
            <Text style={styles.emptyText}>Ajoutez votre première plantation pour activer la surveillance IA.</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('AddPlantation')}>
              <Text style={styles.emptyBtnText}>Ajouter une culture</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filtered.map(p => (
            <PlantationCard
              key={p.id}
              plantation={p}
              onPress={() => navigation.navigate('PlantationDetail', { plantation: p })}
            />
          ))
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgPrimary },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  title: { fontSize: 18, fontFamily: FONTS.bold, color: COLORS.text },
  sub: { fontSize: 12, fontFamily: FONTS.regular, color: COLORS.textMuted, marginTop: 1 },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: RADIUS.md, borderWidth: 1,
    borderColor: COLORS.brandBorder, backgroundColor: COLORS.brandBg,
  },
  addBtnText: { fontSize: 13, fontFamily: FONTS.semibold, color: COLORS.brand },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    margin: SPACING.md,
    backgroundColor: COLORS.bgTertiary,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md, paddingHorizontal: 12, paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: FONTS.regular, color: COLORS.text, padding: 0 },
  filterScroll: { maxHeight: 40 },
  filterContent: { paddingHorizontal: SPACING.md, gap: 6 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.bgPrimary,
  },
  filterChipActive: { backgroundColor: COLORS.brand, borderColor: COLORS.brand },
  filterText: { fontSize: 13, fontFamily: FONTS.medium, color: COLORS.textSecondary },
  filterTextActive: { color: '#FFF', fontFamily: FONTS.semibold },
  list: { flex: 1, backgroundColor: COLORS.bgSecondary },
  listContent: { padding: SPACING.md },
  empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyTitle: { fontSize: 16, fontFamily: FONTS.semibold, color: COLORS.text },
  emptyText: { fontSize: 13, fontFamily: FONTS.regular, color: COLORS.textMuted, textAlign: 'center', lineHeight: 18, paddingHorizontal: 32 },
  emptyBtn: {
    marginTop: 4, paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: RADIUS.md, backgroundColor: COLORS.brand,
  },
  emptyBtnText: { fontSize: 14, fontFamily: FONTS.semibold, color: '#FFF' },
});
