import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { useTheme } from '@/src/theme/ThemeContext';
import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { Button } from '@/src/components/common/Button';
import { formatVND } from '@/src/utils/formatters';
import type { MenuItem } from '@/src/features/menu/types/menu.types';
import { mealRecommendationService } from '@/src/features/customer-order/services/mealRecommendationService';
import type { MealRecommendationSurvey, SurveyQuestion } from '@/src/features/customer-order/services/mealRecommendationService';

interface MealSuggestionCardProps {
  items: MenuItem[];
  message: string;
  available: boolean;
  onAdd: (item: MenuItem) => void;
  onRecommendations: (items: MenuItem[], message: string, available: boolean) => void;
}

export function MealSuggestionCard({ items, message, available, onAdd, onRecommendations }: MealSuggestionCardProps) {
  const { theme } = useTheme();
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [partySize, setPartySize] = useState('2');
  const [companions, setCompanions] = useState<'family' | 'friends' | undefined>();
  const [wantsDrinking, setWantsDrinking] = useState<boolean | undefined>();
  const [wantsNovelty, setWantsNovelty] = useState(false);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [loadingSurvey, setLoadingSurvey] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [surveyError, setSurveyError] = useState('');

  const visibleQuestions = useMemo(() => questions.filter((question) => {
    const min = question.show_if?.party_size_min;
    return min == null || Number(partySize) >= min;
  }), [questions, partySize]);
  const currentQuestion = visibleQuestions[questionIndex];

  const openSurvey = async () => {
    setLoadingSurvey(true);
    setSurveyError('');
    try {
      const loaded = await mealRecommendationService.getSurveyQuestions();
      setQuestions(loaded);
      setQuestionIndex(0);
      setSurveyOpen(true);
    } catch (error) {
      setSurveyError(error instanceof Error ? error.message : 'Không thể tải câu hỏi khảo sát.');
    } finally {
      setLoadingSurvey(false);
    }
  };

  const updateAnswer = (attribute: string, selected: boolean) => {
    setAnswers((current) => ({ ...current, [attribute]: selected }));
  };

  const submitSurvey = async () => {
    const count = Number(partySize);
    if (!Number.isInteger(count) || count < 1) {
      setSurveyError('Vui lòng nhập số người hợp lệ (từ 1 trở lên).');
      return;
    }
    if (count >= 7 && (!companions || wantsDrinking === undefined)) {
      setSurveyError('Vui lòng trả lời các câu hỏi dành cho bàn từ 7 người.');
      return;
    }
    setSubmitting(true);
    setSurveyError('');
    const survey: MealRecommendationSurvey = {
      party_size: count,
      companions,
      wants_drinking: wantsDrinking,
      wants_novelty: wantsNovelty,
      answers,
    };
    try {
      const result = await mealRecommendationService.getRecommendations({
        survey,
        k: count >= 7 ? 10 : 6,
      });
      onRecommendations(result.items, result.message, result.available);
      setSurveyOpen(false);
    } catch (error) {
      setSurveyError(error instanceof Error ? error.message : 'Không thể lấy gợi ý lúc này.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderChoice = (label: string, selected: boolean, onPress: () => void) => (
    <Pressable
      key={label}
      onPress={onPress}
      style={[styles.choice, {
        borderColor: selected ? theme.colors.primary : theme.colors.border,
        backgroundColor: selected ? theme.colors.primaryContainer : theme.colors.surface,
        borderRadius: theme.radius.md,
      }]}
    >
      <Text style={{ color: selected ? theme.colors.onPrimaryContainer : theme.colors.onSurface, fontSize: 13 }}>
        {selected ? '✓  ' : ''}{label}
      </Text>
    </Pressable>
  );

  const renderSurveyQuestion = () => {
    if (!currentQuestion) return null;
    if (currentQuestion.kind === 'number') {
      return (
        <TextInput
          value={partySize}
          onChangeText={setPartySize}
          keyboardType="number-pad"
          placeholder="Nhập số người"
          style={[styles.numberInput, { color: theme.colors.onSurface, borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}
        />
      );
    }
    if (currentQuestion.kind === 'single') {
      return <View style={styles.choices}>{(currentQuestion.options ?? []).map((option) =>
        renderChoice(option.text, companions === option.value, () => setCompanions(option.value as 'family' | 'friends'))
      )}</View>;
    }
    if (currentQuestion.kind === 'yes_no' && currentQuestion.field === 'wants_drinking') {
      return <View style={styles.choices}>
        {renderChoice('Có', wantsDrinking === true, () => setWantsDrinking(true))}
        {renderChoice('Không', wantsDrinking === false, () => setWantsDrinking(false))}
      </View>;
    }
    if (currentQuestion.kind === 'yes_no') {
      return <View style={styles.choices}>
        {renderChoice('Có', wantsNovelty, () => setWantsNovelty(true))}
        {renderChoice('Không', !wantsNovelty, () => setWantsNovelty(false))}
      </View>;
    }
    return (
      <View style={styles.choices}>
        {(currentQuestion.options ?? []).map((option) => {
          const key = option.attribute ?? '';
          return renderChoice(option.text, Boolean(answers[key]), () => {
            const next = !answers[key];
            updateAnswer(key, next);
            if (currentQuestion.id === 'table_members' && next) {
              (currentQuestion.options ?? []).forEach((entry) => {
                if (entry.attribute && entry.attribute !== key) updateAnswer(entry.attribute, false);
              });
            }
          });
        })}
        {currentQuestion.none_option ? renderChoice(currentQuestion.none_option,
          currentQuestion.id === 'table_members' && !(currentQuestion.options ?? []).some((option) => answers[option.attribute ?? '']),
          () => (currentQuestion.options ?? []).forEach((option) => option.attribute && updateAnswer(option.attribute, false))
        ) : null}
      </View>
    );
  };

  const nextQuestion = () => {
    if (questionIndex < visibleQuestions.length - 1) setQuestionIndex((index) => index + 1);
    else void submitSurvey();
  };

  return (
    <Card padding="md" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Sparkles size={18} color={theme.colors.secondary} />
          <Text style={[styles.title, { color: theme.colors.onSurface, fontFamily: theme.typography.display }]}>
            Gợi ý món ăn dành cho bạn
          </Text>
        </View>
        <Badge label={items.length > 0 ? 'Đề xuất' : available ? 'AI đã kết nối' : 'Khảo sát AI'} tone="info" />
      </View>

      {!surveyOpen ? (
        <>
          <Text style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>{message}</Text>
          <Button label={loadingSurvey ? 'Đang tải khảo sát...' : 'Khảo sát để nhận gợi ý phù hợp'} size="md" variant="secondary" disabled={loadingSurvey} onPress={() => void openSurvey()} />
          {surveyError ? <Text style={{ color: theme.colors.error, fontSize: 12 }}>{surveyError}</Text> : null}
          {items.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
              {items.map((item) => {
                const unavailable = item.status === 'OUT_OF_STOCK' || item.price <= 0 || item.pricingType === 'MARKET_PRICE' || item.pricingType === 'UNSET';
                const isPerUnit = item.pricingType === 'PER_UNIT';
                const hasUnit = isPerUnit || Boolean(item.priceUnit);
                const priceUnit = item.priceUnit || (isPerUnit ? 'lạng' : 'phần');
                return (
                  <View key={item.id} style={[styles.suggestion, { backgroundColor: theme.colors.surfaceLow, borderColor: theme.colors.border, borderRadius: theme.radius.md, opacity: unavailable ? 0.6 : 1 }]}>
                    <Text numberOfLines={2} style={[styles.itemName, { color: theme.colors.onSurface }]}>{item.name}</Text>
                    <Text style={[styles.price, { color: theme.colors.secondary, fontFamily: theme.typography.mono }]}>
                      {unavailable ? 'Liên hệ nhân viên' : `${formatVND(item.price)}${hasUnit ? `/${priceUnit}` : ''}`}
                    </Text>
                    <Button label={item.status === 'OUT_OF_STOCK' ? 'Hết món' : unavailable ? 'Liên hệ nhân viên' : 'Thêm món'} size="sm" variant="primary" disabled={unavailable} onPress={() => onAdd(item)} />
                  </View>
                );
              })}
            </ScrollView>
          ) : null}
        </>
      ) : (
        <View style={styles.survey}>
          <Text style={[styles.progress, { color: theme.colors.secondary }]}>
            Câu {Math.min(questionIndex + 1, visibleQuestions.length)} / {visibleQuestions.length}
          </Text>
          <Text style={[styles.question, { color: theme.colors.onSurface }]}>{currentQuestion?.text}</Text>
          {renderSurveyQuestion()}
          {surveyError ? <Text style={{ color: theme.colors.error, fontSize: 12 }}>{surveyError}</Text> : null}
          <View style={styles.actions}>
            <Button label="Hủy" size="sm" variant="ghost" disabled={submitting} onPress={() => setSurveyOpen(false)} />
            {questionIndex > 0 ? <Button label="Quay lại" size="sm" variant="secondary" disabled={submitting} onPress={() => setQuestionIndex((index) => Math.max(0, index - 1))} /> : null}
            <Button label={submitting ? 'Đang phân tích...' : questionIndex >= visibleQuestions.length - 1 ? 'Nhận gợi ý' : 'Tiếp theo'} size="sm" variant="primary" disabled={submitting} onPress={nextQuestion} />
          </View>
          {submitting ? <ActivityIndicator color={theme.colors.primary} /> : null}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: 10 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 15, fontWeight: '700' },
  list: { gap: 8, paddingVertical: 2 },
  suggestion: { width: 170, minHeight: 116, borderWidth: 1, padding: 10, justifyContent: 'space-between', gap: 8 },
  itemName: { fontSize: 13, fontWeight: '700', minHeight: 34 },
  price: { fontSize: 12, fontWeight: '700' },
  message: { fontSize: 13, lineHeight: 19 },
  survey: { gap: 12, paddingTop: 4 },
  progress: { fontSize: 12, fontWeight: '700' },
  question: { fontSize: 16, fontWeight: '700', lineHeight: 23 },
  choices: { gap: 8 },
  choice: { borderWidth: 1, padding: 12 },
  numberInput: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
});
