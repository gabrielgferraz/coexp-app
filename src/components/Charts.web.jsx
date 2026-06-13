/**
 * Charts.web.jsx — loaded ONLY on web by Metro's platform resolution.
 * Uses Victory Native's web-compatible API via victory (no native modules).
 * If victory isn't installed either, falls back to a pure-RN bar rendered with Views.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';

const PIE_COLORS = ['#1A3A2A', '#4CAF50', '#81C784', '#FF8F00', '#42A5F5'];

// ── Simple view-based bar chart (no external lib needed) ─────────────────────
export function BarChartComp({ data }) {
  const max = Math.max(...data.map(i => i.qtd ?? 0), 1);

  return (
    <View style={bar.container}>
      {data.map((item, idx) => {
        const pct = ((item.qtd ?? 0) / max) * 100;
        return (
          <View key={item.id ?? idx} style={bar.col}>
            <Text style={bar.value}>{item.qtd ?? 0}</Text>
            <View style={bar.track}>
              <View style={[bar.fill, { height: `${pct}%`, backgroundColor: colors.primary }]} />
            </View>
            <Text style={bar.label} numberOfLines={1}>{item.nome?.slice(0, 7)}</Text>
          </View>
        );
      })}
    </View>
  );
}

// ── Simple view-based pie / donut legend ─────────────────────────────────────
export function PieChartComp({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;

  return (
    <View style={pie.container}>
      {/* Donut drawn with conic-gradient on web via a div */}
      <div style={donutStyle(data, total)} />

      {/* Legend */}
      <View style={pie.legend}>
        {data.map((entry, idx) => (
          <View key={idx} style={pie.row}>
            <View style={[pie.dot, { backgroundColor: entry.color }]} />
            <Text style={pie.label}>
              {entry.name}{'  '}
              <Text style={pie.pct}>
                {((entry.value / total) * 100).toFixed(0)}%
              </Text>
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function donutStyle(data, total) {
  let cumulative = 0;
  const stops = data.map(d => {
    const start = (cumulative / total) * 360;
    cumulative += d.value;
    const end = (cumulative / total) * 360;
    return `${d.color} ${start}deg ${end}deg`;
  });

  return {
    width: 130,
    height: 130,
    borderRadius: '50%',
    background: `conic-gradient(${stops.join(', ')})`,
    WebkitMask: 'radial-gradient(circle, transparent 40%, black 41%)',
    mask: 'radial-gradient(circle, transparent 40%, black 41%)',
    flexShrink: 0,
  };
}

const bar = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 180,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.xs,
  },
  col: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  value: {
    fontSize: typography.sizes.xs,
    color: colors.text,
    fontWeight: '700',
    marginBottom: 2,
  },
  track: {
    width: '70%',
    height: '75%',
    backgroundColor: colors.borderLight,
    borderRadius: radius.sm,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  fill: {
    width: '100%',
    borderRadius: radius.sm,
  },
  label: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});

const pie = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.lg,
  },
  legend: { flex: 1, gap: spacing.xs },
  row:    { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  dot:    { width: 12, height: 12, borderRadius: 6 },
  label:  { fontSize: typography.sizes.sm, color: colors.text },
  pct:    { color: colors.textSecondary, fontWeight: '600' },
});
