'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Calculator, TrendingUp, Users, DollarSign, Info, CheckCircle, Clock, PieChart, BarChart3, Target, Lightbulb, Gift, Heart, GraduationCap, Calendar, FileText, PiggyBank, TrendingDown, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  GiftTaxCalculator, 
  GiftTaxInputValidator
} from '@/lib/utils/gift-tax-calculations';
import { GiftTaxInput, GiftTaxResult } from '@/types/tax-calculator.types';
import { GIFT_TAX_LIMITS_2024 } from '@/constants/tax-rates-2024';
import TaxCalculatorDisclaimer from './TaxCalculatorDisclaimer';

import { formatNumber, formatWon } from '@/lib/utils';
import { NumberInput } from '@/components/ui/number-input';

export default function GiftTaxCalculatorComponent() {
  const [input, setInput] = useState<GiftTaxInput>({
    // Í∏∞Î≥∏ Ï¶ùÏó¨ ?ïÎ≥¥
    giftAmount: 0,
    giftDate: new Date().toISOString().split('T')[0],
    
    // Ï¶ùÏó¨???ïÎ≥¥
    donorAge: 50,
    donorRelation: 'parent',
    
    // ?òÏ¶ù???ïÎ≥¥
    recipientAge: 25,
    isRecipientMinor: false,
    isRecipientDisabled: false,
    
    // Ï¶ùÏó¨ ?ïÌÉú
    giftType: 'money',
    isConditionalGift: false,
    giftConditionValue: 0,
    
    // ?¨ÏÇ∞ Î∂ÑÎ•ò
    cash: 0,
    realEstate: 0,
    stock: 0,
    bond: 0,
    businessAsset: 0,
    other: 0,
    
    // ?πÏàò Ï¶ùÏó¨
    marriageGift: false,
    marriageGiftAmount: 0,
    educationGift: false,
    educationGiftAmount: 0,
    
    // 10????Í∏∞Ï°¥ Ï¶ùÏó¨
    previousGifts: [],
    
    // Í≥µÏ†ú Î∞?Í∞êÎ©¥
    familyBusinessDiscount: false,
    farmLandDiscount: false,
    culturalAssetDiscount: false,
    startupDiscount: false,
    
    // Í∏∞Ì?
    previousTaxPaid: 0,
    isNonResident: false,
    hasSpecialRelationship: false
  });

  const [result, setResult] = useState<GiftTaxResult | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isCalculating, setIsCalculating] = useState(false);

  // ?î• Í≥†ÎèÑ?îÎêú ?êÎèô ?∞Í≥Ñ Í≥ÑÏÇ∞ Î°úÏßÅ
  
  // 1. Ï¥?Ï¶ùÏó¨???êÎèô Í≥ÑÏÇ∞
  const totalGiftAmount = useMemo(() => {
    return input.cash + input.realEstate + input.stock + input.bond + 
           input.businessAsset + input.other;
  }, [input.cash, input.realEstate, input.stock, input.bond, 
      input.businessAsset, input.other]);

  // 2. ?πÏàò Ï¶ùÏó¨ Ï¥ùÏï° Í≥ÑÏÇ∞
  const specialGiftTotal = useMemo(() => {
    let total = 0;
    if (input.marriageGift) total += input.marriageGiftAmount;
    if (input.educationGift) total += input.educationGiftAmount;
    return total;
  }, [input.marriageGift, input.marriageGiftAmount, input.educationGift, input.educationGiftAmount]);

  // 3. Í¥ÄÍ≥ÑÎ≥Ñ Í≥µÏ†ú?úÎèÑ ?êÎèô Í≥ÑÏÇ∞
  const deductionLimits = useMemo(() => {
    const relationship = input.donorRelation;
    const limits = GIFT_TAX_LIMITS_2024.relationshipLimits;
    
    let basicDeduction = 0;
    let specialDeduction = 0;
    
    switch (relationship) {
      case 'spouse':
        basicDeduction = limits.spouse.annual;
        break;
      case 'parent':
      case 'grandparent':
        basicDeduction = limits.linealAscendant.annual;
        if (input.recipientAge >= 19) {
          basicDeduction = limits.linealAscendant.annual; // 5Ï≤úÎßå??        }
        break;
      case 'child':
      case 'grandchild':
        basicDeduction = limits.linealDescendant.annual;
        if (input.isRecipientMinor) {
          basicDeduction = limits.linealDescendant.annual; // 2Ï≤úÎßå??        }
        break;
      default:
        basicDeduction = limits.other.annual;
    }
    
    // ?πÏàò Í≥µÏ†ú (?ºÏù∏, ÍµêÏú° ??
    if (input.marriageGift) {
      specialDeduction += 100000000; // ?ºÏù∏Ï¶ùÏó¨ 1?µÏõê Ï∂îÍ?
    }
    if (input.educationGift) {
      specialDeduction += 30000000; // ÍµêÏú°Îπ?Ï¶ùÏó¨ 3Ï≤úÎßå??Ï∂îÍ?
    }
    
    return {
      basic: basicDeduction,
      special: specialDeduction,
      total: basicDeduction + specialDeduction
    };
  }, [input.donorRelation, input.recipientAge, input.isRecipientMinor, 
      input.marriageGift, input.educationGift]);

  // 4. 10????Í∏∞Ï°¥ Ï¶ùÏó¨ ?©ÏÇ∞
  const previousGiftTotal = useMemo(() => {
    return input.previousGifts.reduce((sum, gift) => sum + gift.amount, 0);
  }, [input.previousGifts]);

  // 5. Í≥ºÏÑ∏?úÏ? ?êÎèô Í≥ÑÏÇ∞
  const estimatedTaxableIncome = useMemo(() => {
    const currentGift = Math.max(input.giftAmount, totalGiftAmount);
    const totalGiftWithPrevious = currentGift + previousGiftTotal;
    return Math.max(0, totalGiftWithPrevious - deductionLimits.total);
  }, [input.giftAmount, totalGiftAmount, previousGiftTotal, deductionLimits.total]);

  // 6. ?àÏÉÅ ?∏Ïú® Íµ¨Í∞Ñ Í≥ÑÏÇ∞
  const expectedTaxBracket = useMemo(() => {
    if (estimatedTaxableIncome <= 0) {
      return { rate: 0, description: 'ÎπÑÍ≥º??(Í≥µÏ†ú????' };
    } else if (estimatedTaxableIncome <= 100000000) {
      return { rate: 10, description: '10% Íµ¨Í∞Ñ (1?µÏõê ?¥Ìïò)' };
    } else if (estimatedTaxableIncome <= 500000000) {
      return { rate: 20, description: '20% Íµ¨Í∞Ñ (5?µÏõê ?¥Ìïò)' };
    } else if (estimatedTaxableIncome <= 1000000000) {
      return { rate: 30, description: '30% Íµ¨Í∞Ñ (10?µÏõê ?¥Ìïò)' };
    } else if (estimatedTaxableIncome <= 3000000000) {
      return { rate: 40, description: '40% Íµ¨Í∞Ñ (30?µÏõê ?¥Ìïò)' };
    } else {
      return { rate: 50, description: '50% Íµ¨Í∞Ñ (30?µÏõê Ï¥àÍ≥º)' };
    }
  }, [estimatedTaxableIncome]);

  // 7. ?ºÎ¶¨???§Î•ò Ï≤¥ÌÅ¨
  const logicalErrors = useMemo(() => {
    const errors: string[] = [];
    
    // Ï¶ùÏó¨??Î∂àÏùºÏπ?Ï≤¥ÌÅ¨
    if (totalGiftAmount > 0 && Math.abs(totalGiftAmount - input.giftAmount) > 100000) {
      errors.push(`?¨ÏÇ∞Î≥??©Í≥Ñ(${formatWon(totalGiftAmount)})?Ä Ï¥?Ï¶ùÏó¨??${formatWon(input.giftAmount)})???§Î¶Ö?àÎã§.`);
    }
    
    // ÎØ∏ÏÑ±?ÑÏûê ?òÏù¥ Ï≤¥ÌÅ¨
    if (input.isRecipientMinor && input.recipientAge >= 19) {
      errors.push('19???¥ÏÉÅ?Ä ÎØ∏ÏÑ±?ÑÏûêÍ∞Ä ?ÑÎãô?àÎã§.');
    }
    
    // ÎØ∏Îûò ?†Ïßú Ï≤¥ÌÅ¨
    const today = new Date();
    const giftDate = new Date(input.giftDate);
    if (giftDate > today) {
      errors.push('Ï¶ùÏó¨?ºÏù¥ ÎØ∏Îûò ?†ÏßúÎ°??§Ï†ï?òÏñ¥ ?àÏäµ?àÎã§.');
    }
    
    // ?ºÏù∏ Ï¶ùÏó¨ Ï°∞Í±¥ Ï≤¥ÌÅ¨
    if (input.marriageGift && input.marriageGiftAmount === 0) {
      errors.push('?ºÏù∏ Ï¶ùÏó¨Î•?Ï≤¥ÌÅ¨?àÏ?Îß?Í∏àÏï°???ÖÎ†•?òÏ? ?äÏïò?µÎãà??');
    }
    
    // ÍµêÏú°Îπ?Ï¶ùÏó¨ Ï°∞Í±¥ Ï≤¥ÌÅ¨
    if (input.educationGift && input.educationGiftAmount === 0) {
      errors.push('ÍµêÏú°Îπ?Ï¶ùÏó¨Î•?Ï≤¥ÌÅ¨?àÏ?Îß?Í∏àÏï°???ÖÎ†•?òÏ? ?äÏïò?µÎãà??');
    }
    
    // ?πÏàò Í¥ÄÍ≥?Ï≤¥ÌÅ¨
    if (input.hasSpecialRelationship && input.donorRelation === 'spouse') {
      errors.push('Î∞∞Ïö∞??Í¥ÄÍ≥ÑÏ? ?πÏàòÍ¥ÄÍ≥ÑÎ? ?ôÏãú???ÅÏö©?????ÜÏäµ?àÎã§.');
    }
    
    return errors;
  }, [input, totalGiftAmount]);

  // 8. ?àÏÑ∏ Ï∂îÏ≤ú Î°úÏßÅ
  const taxSavingRecommendations = useMemo(() => {
    const recommendations: string[] = [];
    
    // Í≥µÏ†ú ?úÎèÑ ?úÏö© Ï∂îÏ≤ú
    const remainingDeduction = deductionLimits.total - input.giftAmount;
    if (remainingDeduction > 10000000 && input.giftAmount > 0) {
      recommendations.push(`Í¥ÄÍ≥ÑÎ≥Ñ Í≥µÏ†ú?úÎèÑ ${formatWon(remainingDeduction)} Ï∂îÍ? ?úÏö© Í∞Ä??);
    }
    
    // ?ºÏù∏ Ï¶ùÏó¨ Ï∂îÏ≤ú
    if (!input.marriageGift && input.recipientAge >= 18 && input.recipientAge <= 50 && 
        input.donorRelation === 'parent') {
      recommendations.push('?ºÏù∏ ??1?µÏõê Ï∂îÍ? Í≥µÏ†ú ?úÌÉù ?úÏö© Í≤Ä??);
    }
    
    // ÍµêÏú°Îπ?Ï¶ùÏó¨ Ï∂îÏ≤ú
    if (!input.educationGift && input.recipientAge <= 30 && 
        (input.donorRelation === 'parent' || input.donorRelation === 'grandparent')) {
      recommendations.push('ÍµêÏú°Îπ?Î™ÖÎ™© 3Ï≤úÎßå??Ï∂îÍ? Í≥µÏ†ú Í≤Ä??);
    }
    
    // Î∂ÑÌï† Ï¶ùÏó¨ Ï∂îÏ≤ú
    if (estimatedTaxableIncome > 500000000) {
      recommendations.push('?¨Îü¨ ?¥Ïóê Í±∏Ïπú Î∂ÑÌï† Ï¶ùÏó¨Î°??ÑÏßÑ?∏Ïú® Î∂Ä???ÑÌôî');
    }
    
    // Í∞Ä?ÖÏäπÍ≥??†Ïù∏ Ï∂îÏ≤ú
    if (!input.familyBusinessDiscount && input.businessAsset > 100000000) {
      recommendations.push('Í∞Ä?ÖÏäπÍ≥??îÍ±¥ Ï∂©Ï°± ??30% ?†Ïù∏ ?úÌÉù');
    }
    
    // ?çÏ? Í∞êÎ©¥ Ï∂îÏ≤ú
    if (!input.farmLandDiscount && input.realEstate > 50000000) {
      recommendations.push('?çÏ? Ï¶ùÏó¨ ??Í∞êÎ©¥ ?úÌÉù Í≤Ä??);
    }
    
    return recommendations;
  }, [input, estimatedTaxableIncome, deductionLimits]);

  // 9. ?êÎèô Í∞??ôÍ∏∞??  useEffect(() => {
    // ?¨ÏÇ∞Î≥??©Í≥ÑÍ∞Ä Ï¥?Ï¶ùÏó¨?°Í≥º ?§Î•¥Í≥? ?¨ÏÇ∞Î≥??ÖÎ†•???àÎã§Î©?Ï¥?Ï¶ùÏó¨???ÖÎç∞?¥Ìä∏
    if (totalGiftAmount > 0 && input.giftAmount === 0) {
      handleInputChange('giftAmount', totalGiftAmount);
    }
  }, [totalGiftAmount, input.giftAmount]);

  const handleInputChange = useCallback((field: keyof GiftTaxInput, value: any) => {
    setInput(prev => {
      const updated = { ...prev, [field]: value };
      
      // ?êÎèô Í≥ÑÏÇ∞?òÎäî Í∞íÎì§
      if (field === 'recipientAge') {
        updated.isRecipientMinor = value < 19;
      }
      
      if (field === 'giftAmount' || field === 'marriageGiftAmount' || field === 'educationGiftAmount') {
        // Ï¥?Ï¶ùÏó¨???ÖÎç∞?¥Ìä∏??Ïª¥Ìè¨?åÌä∏?êÏÑú ?êÎèô?ºÎ°ú Ï≤òÎ¶¨??      }
      
      return updated;
    });
  }, []);

  const handleCalculate = () => {
    setIsCalculating(true);
    setErrors({});
    
    try {
      // ?ÖÎ†•Í∞?Í≤ÄÏ¶?      const validationErrors = GiftTaxInputValidator.validate(input);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setIsCalculating(false);
        return;
      }

      // ?ÖÎ†•Í∞??ïÍ∑ú??      const validatedInput = GiftTaxInputValidator.validateAndApplyLimits(input);
      
      // Í≥ÑÏÇ∞ ?§Ìñâ
      const calculator = new GiftTaxCalculator(validatedInput);
      const calculationResult = calculator.calculate();
      
      setResult(calculationResult);
    } catch (error) {
      console.error('Ï¶ùÏó¨??Í≥ÑÏÇ∞ ?§Î•ò:', error);
      setErrors({ general: 'Í≥ÑÏÇ∞ Ï§??§Î•òÍ∞Ä Î∞úÏÉù?àÏäµ?àÎã§.' });
    } finally {
      setIsCalculating(false);
    }
  };

  const loadSampleData = () => {
    setInput({
      // Í∏∞Î≥∏ Ï¶ùÏó¨ ?ïÎ≥¥
      giftAmount: 80000000, // 8Ï≤úÎßå??      giftDate: '2024-01-15',
      
      // Ï¶ùÏó¨???ïÎ≥¥
      donorAge: 60,
      donorRelation: 'parent',
      
      // ?òÏ¶ù???ïÎ≥¥
      recipientAge: 30,
      isRecipientMinor: false,
      isRecipientDisabled: false,
      
      // Ï¶ùÏó¨ ?ïÌÉú
      giftType: 'money',
      isConditionalGift: false,
      giftConditionValue: 0,
      
      // ?¨ÏÇ∞ Î∂ÑÎ•ò
      cash: 80000000,
      realEstate: 0,
      stock: 0,
      bond: 0,
      businessAsset: 0,
      other: 0,
      
      // ?πÏàò Ï¶ùÏó¨
      marriageGift: false,
      marriageGiftAmount: 0,
      educationGift: false,
      educationGiftAmount: 0,
      
      // 10????Í∏∞Ï°¥ Ï¶ùÏó¨
      previousGifts: [
        {
          date: '2022-03-10',
          amount: 30000000,
          taxPaid: 0
        }
      ],
      
      // Í≥µÏ†ú Î∞?Í∞êÎ©¥
      familyBusinessDiscount: false,
      farmLandDiscount: false,
      culturalAssetDiscount: false,
      startupDiscount: false,
      
      // Í∏∞Ì?
      previousTaxPaid: 0,
      isNonResident: false,
      hasSpecialRelationship: false
    });
  };

  const resetInputs = () => {
    setInput({
      giftAmount: 0,
      giftDate: new Date().toISOString().split('T')[0],
      donorAge: 50,
      donorRelation: 'parent',
      recipientAge: 25,
      isRecipientMinor: false,
      isRecipientDisabled: false,
      giftType: 'money',
      isConditionalGift: false,
      giftConditionValue: 0,
      cash: 0,
      realEstate: 0,
      stock: 0,
      bond: 0,
      businessAsset: 0,
      other: 0,
      marriageGift: false,
      marriageGiftAmount: 0,
      educationGift: false,
      educationGiftAmount: 0,
      previousGifts: [],
      familyBusinessDiscount: false,
      farmLandDiscount: false,
      culturalAssetDiscount: false,
      startupDiscount: false,
      previousTaxPaid: 0,
      isNonResident: false,
      hasSpecialRelationship: false
    });
    setResult(null);
    setErrors({});
  };

  // ?êÎèô Í≥ÑÏÇ∞ (?ÖÎ†•Í∞?Î≥ÄÍ≤???
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.giftAmount > 0) {
        handleCalculate();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [input]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ?§Îçî */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Gift className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Ï¶ùÏó¨??Í≥ÑÏÇ∞Í∏?/h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Ï¶ùÏó¨?¨ÏÇ∞??Ï¢ÖÎ•ò?Ä Í¥ÄÍ≥ÑÏóê ?∞Î•∏ ?ïÌôï??Ï¶ùÏó¨?∏Î? Í≥ÑÏÇ∞?¥Î≥¥?∏Ïöî. 
          10???©ÏÇ∞Í≥ºÏÑ∏?Ä Í∞ÅÏ¢Ö Í≥µÏ†úÎ•?Î∞òÏòÅ?òÏó¨ ?ïÎ??òÍ≤å Í≥ÑÏÇ∞?©Îãà??
        </p>
      </div>

      {/* Î©¥Ï±Ö Ï°∞Ìï≠ */}
      <TaxCalculatorDisclaimer variant="summary" />

      {/* ?î• ?§Îßà???êÎèô Í≥ÑÏÇ∞ ?Ä?úÎ≥¥??*/}
      <Card className="border-pink-200 bg-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-700 text-lg">
            <Gift className="w-5 h-5" />
            ???§Îßà??Ï¶ùÏó¨???êÎèô Í≥ÑÏÇ∞ ?Ä?úÎ≥¥??          </CardTitle>
          <CardDescription className="text-pink-600">
            ?ÖÎ†•?òÎäî Ï¶âÏãú Í¥Ä??Í∞íÎì§???êÎèô?ºÎ°ú ?∞Í≥Ñ Í≥ÑÏÇ∞?òÍ≥† ?àÏÑ∏ Î∞©Ïïà???úÏãú?©Îãà??          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Ï¥?Ï¶ùÏó¨??*/}
            <div className="bg-white p-3 rounded border border-pink-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Ï¥?Ï¶ùÏó¨??/span>
                <Badge className="text-xs bg-green-100 text-green-700 border-green-300">?êÎèô</Badge>
              </div>
              <div className="text-lg font-bold text-pink-700">
                {formatWon(Math.max(input.giftAmount, totalGiftAmount))}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                ?¨ÏÇ∞Î≥??©Í≥Ñ ?êÎäî ÏßÅÏ†ë ?ÖÎ†•
              </div>
            </div>

            {/* ?ÅÏö© Í≥µÏ†ú??*/}
            <div className="bg-white p-3 rounded border border-pink-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">?ÅÏö© Í≥µÏ†ú??/span>
                <Badge className="text-xs bg-green-100 text-green-700 border-green-300">?êÎèô</Badge>
              </div>
              <div className="text-lg font-bold text-pink-700">
                {formatWon(deductionLimits.total)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Í¥ÄÍ≥ÑÎ≥Ñ + ?πÏàòÍ≥µÏ†ú
              </div>
            </div>

            {/* ?àÏÉÅ ?∏Ïú® Íµ¨Í∞Ñ */}
            <div className="bg-white p-3 rounded border border-pink-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">?àÏÉÅ ?∏Ïú®</span>
                <Badge className={`text-xs ${expectedTaxBracket.rate === 0 ? 'bg-green-100 text-green-700' : 
                  expectedTaxBracket.rate <= 20 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                  {expectedTaxBracket.rate}%
                </Badge>
              </div>
              <div className={`text-lg font-bold ${expectedTaxBracket.rate === 0 ? 'text-green-700' : 
                expectedTaxBracket.rate <= 20 ? 'text-yellow-700' : 'text-red-700'}`}>
                {expectedTaxBracket.rate}% Íµ¨Í∞Ñ
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {expectedTaxBracket.description}
              </div>
            </div>

            {/* Í≥ºÏÑ∏?úÏ? */}
            <div className="bg-white p-3 rounded border border-pink-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Í≥ºÏÑ∏?úÏ?</span>
                <Badge className="text-xs bg-green-100 text-green-700 border-green-300">?êÎèô</Badge>
              </div>
              <div className="text-lg font-bold text-pink-700">
                {formatWon(estimatedTaxableIncome)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                (Ï¶ùÏó¨??10?ÑÎÇ¥Í∏∞Ï°¥) - Í≥µÏ†ú
              </div>
            </div>
          </div>

          {/* Í≥µÏ†ú ?∏Î? ?¥Ïó≠ */}
          {deductionLimits.total > 0 && (
            <div className="mt-4 p-3 bg-white rounded border border-pink-200">
              <div className="text-sm font-medium text-gray-700 mb-3">?éÅ Í≥µÏ†ú ?∏Î? ?¥Ïó≠</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                <div className="p-2 rounded bg-green-50 border border-green-200">
                  <div className="font-medium text-green-800">Í∏∞Î≥∏Í≥µÏ†ú</div>
                  <div className="font-mono text-right text-green-700">
                    {formatWon(deductionLimits.basic)}
                  </div>
                  <div className="text-right text-xs text-green-600">
                    {input.donorRelation === 'spouse' ? 'Î∞∞Ïö∞?? :
                     input.donorRelation === 'parent' ? 'Î∂ÄÎ™? :
                     input.donorRelation === 'child' ? '?êÎ?' : 'Í∏∞Ì?'} Í¥ÄÍ≥?                  </div>
                </div>
                
                {deductionLimits.special > 0 && (
                  <>
                    {input.marriageGift && input.marriageGiftAmount > 0 && (
                      <div className="p-2 rounded bg-pink-50 border border-pink-200">
                        <div className="font-medium text-pink-800 flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          ?ºÏù∏Í≥µÏ†ú
                        </div>
                        <div className="font-mono text-right text-pink-700">
                          {formatWon(Math.min(input.marriageGiftAmount, 100000000))}
                        </div>
                        <div className="text-right text-xs text-pink-600">
                          ?âÏÉù 1??                        </div>
                      </div>
                    )}
                    
                    {input.educationGift && input.educationGiftAmount > 0 && (
                      <div className="p-2 rounded bg-blue-50 border border-blue-200">
                        <div className="font-medium text-blue-800 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" />
                          ÍµêÏú°ÎπÑÍ≥µ??                        </div>
                        <div className="font-mono text-right text-blue-700">
                          {formatWon(Math.min(input.educationGiftAmount, 50000000))}
                        </div>
                        <div className="text-right text-xs text-blue-600">
                          ?∞Í∞Ñ?úÎèÑ
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* ?¨ÏÇ∞ Íµ¨ÏÑ± Î∂ÑÏÑù */}
          {totalGiftAmount > 0 && (
            <div className="mt-4 p-3 bg-white rounded border border-pink-200">
              <div className="text-sm font-medium text-gray-700 mb-3">?ìä Ï¶ùÏó¨?¨ÏÇ∞ Íµ¨ÏÑ±</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                {[
                  { label: '?ÑÍ∏à', value: input.cash, color: 'bg-green-100 text-green-700', icon: '?í∞' },
                  { label: 'Î∂Ä?ôÏÇ∞', value: input.realEstate, color: 'bg-orange-100 text-orange-700', icon: '?è†' },
                  { label: 'Ï£ºÏãù', value: input.stock, color: 'bg-blue-100 text-blue-700', icon: '?ìà' },
                  { label: 'Ï±ÑÍ∂å', value: input.bond, color: 'bg-purple-100 text-purple-700', icon: '?ìã' },
                  { label: '?¨ÏóÖ?êÏÇ∞', value: input.businessAsset, color: 'bg-gray-100 text-gray-700', icon: '?è¢' },
                  { label: 'Í∏∞Ì?', value: input.other, color: 'bg-yellow-100 text-yellow-700', icon: '?éØ' }
                ].filter(item => item.value > 0).map((item, index) => (
                  <div key={index} className={`p-2 rounded ${item.color}`}>
                    <div className="font-medium flex items-center gap-1">
                      <span>{item.icon}</span>
                      {item.label}
                    </div>
                    <div className="font-mono text-right">
                      {formatWon(item.value)}
                    </div>
                    <div className="text-right text-xs opacity-75">
                      {((item.value / totalGiftAmount) * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Ï¶ùÏó¨??Í≤ÄÏ¶?*/}
              {Math.abs(totalGiftAmount - input.giftAmount) > 100000 && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                  ?†Ô∏è ?¨ÏÇ∞Î≥??©Í≥Ñ({formatWon(totalGiftAmount)})?Ä Ï¥?Ï¶ùÏó¨??{formatWon(input.giftAmount)})???§Î¶Ö?àÎã§.
                </div>
              )}
            </div>
          )}

          {/* 10????Í∏∞Ï°¥ Ï¶ùÏó¨ ?¥Ïó≠ */}
          {previousGiftTotal > 0 && (
            <div className="mt-4 p-3 bg-white rounded border border-pink-200">
              <div className="text-sm font-medium text-gray-700 mb-3">?ìÖ 10????Í∏∞Ï°¥ Ï¶ùÏó¨</div>
              <div className="space-y-2">
                {input.previousGifts.map((gift, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>{gift.date}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono">{formatWon(gift.amount)}</div>
                      <div className="text-gray-500">?∏Ïï°: {formatWon(gift.taxPaid)}</div>
                    </div>
                  </div>
                ))}
                <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                  <div className="text-sm font-medium text-blue-700">
                    10???©ÏÇ∞?? {formatWon(previousGiftTotal + Math.max(input.giftAmount, totalGiftAmount))}
                  </div>
                  <div className="text-xs text-blue-600">
                    ?ÑÏßÑ?∏Ïú®???ÅÏö©?òÏñ¥ ?∏Î??¥Ïù¥ Ï¶ùÍ??????àÏäµ?àÎã§.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ?ºÎ¶¨???§Î•ò ?§ÏãúÍ∞?Ï≤¥ÌÅ¨ */}
          {logicalErrors.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 rounded border border-red-200">
              <div className="text-sm font-medium text-red-700 mb-2">?ö® ?ºÎ¶¨???§Î•ò Í∞êÏ?</div>
              <div className="space-y-1">
                {logicalErrors.map((error, index) => (
                  <div key={index} className="text-xs text-red-600 flex items-start gap-2">
                    <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ?àÏÑ∏ Ï∂îÏ≤ú */}
          {taxSavingRecommendations.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
              <div className="text-sm font-medium text-green-700 mb-2">?í° ?àÏÑ∏ Ï∂îÏ≤ú</div>
              <div className="space-y-1">
                {taxSavingRecommendations.map((recommendation, index) => (
                  <div key={index} className="text-xs text-green-600 flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>{recommendation}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Í≥ÑÏÇ∞ Ï§ÄÎπ??ÅÌÉú */}
          {logicalErrors.length === 0 && (input.giftAmount > 0 || totalGiftAmount > 0) && (
            <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
              <div className="text-sm font-medium text-green-700 mb-2">??Í≥ÑÏÇ∞ Ï§ÄÎπ??ÑÎ£å</div>
              <div className="text-xs text-green-600">
                Î™®Îì† ?ÑÏàò ?ïÎ≥¥Í∞Ä ?¨Î∞îÎ•¥Í≤å ?ÖÎ†•?òÏóà?µÎãà?? ?§ÏãúÍ∞ÑÏúºÎ°?Ï¶ùÏó¨?∏Í? Í≥ÑÏÇ∞?òÍ≥† ?àÏäµ?àÎã§.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ?ÖÎ†• ?ÅÏó≠ */}
        <div className="space-y-6">
          {/* Ïª®Ìä∏Î°?Î≤ÑÌäº */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Í≥ÑÏÇ∞ ?§Ï†ï
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {/* ?î• Í∞úÏÑ†???òÌîå ?∞Ïù¥??Î≤ÑÌäº */}
                <Button 
                  onClick={loadSampleData}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95]
                    bg-gradient-to-r from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100
                    border-orange-200 text-orange-700 hover:border-orange-300 hover:shadow-md
                    relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-orange-100 to-yellow-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <span className="relative flex items-center gap-2">
                    <FileText className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    ?òÌîå ?∞Ïù¥??                  </span>
                </Button>
                
                {/* ?î• Í∞úÏÑ†??Ï¥àÍ∏∞??Î≤ÑÌäº */}
                <Button 
                  onClick={resetInputs}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95]
                    hover:bg-red-50 hover:border-red-300 hover:text-red-700 hover:shadow-md
                    relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <span className="relative flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                    Ï¥àÍ∏∞??                  </span>
                </Button>
                
                {/* ?î• Í∞úÏÑ†??Í≥ÑÏÇ∞?òÍ∏∞ Î≤ÑÌäº */}
                <Button 
                  onClick={handleCalculate}
                  size="sm"
                  disabled={isCalculating || !input.giftAmount}
                  className={`flex items-center gap-2 transition-all duration-200 transform
                    ${!input.giftAmount ? 
                      'bg-gray-400 cursor-not-allowed' :
                      isCalculating ? 'animate-pulse' :
                      'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                    }
                  `}
                >
                  {isCalculating ? (
                    <Clock className="w-4 h-4 animate-spin" />
                  ) : !input.giftAmount ? (
                    <Calculator className="w-4 h-4 opacity-50" />
                  ) : (
                    <Calculator className="w-4 h-4" />
                  )}
                  {isCalculating ? 'Í≥ÑÏÇ∞ Ï§?..' :
                   !input.giftAmount ? 'Ï¶ùÏó¨Í∏àÏï° ?ÖÎ†• ?ÑÏöî' :
                   (result ? '?¨Í≥Ñ?∞ÌïòÍ∏? : 'Í≥ÑÏÇ∞?òÍ∏∞')
                  }
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ?ÖÎ†• ??*/}
          <Card>
            <CardHeader>
              <CardTitle>Ï¶ùÏó¨ ?ïÎ≥¥ ?ÖÎ†•</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Í∏∞Î≥∏?ïÎ≥¥</TabsTrigger>
                  <TabsTrigger value="parties">?πÏÇ¨??/TabsTrigger>
                  <TabsTrigger value="assets">?¨ÏÇ∞Î∂ÑÎ•ò</TabsTrigger>
                  <TabsTrigger value="special">?πÏàò?¨Ìï≠</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <NumberInput
                      label="Ï¥?Ï¶ùÏó¨?¨ÏÇ∞"
                      value={input.giftAmount}
                      onChange={(value) => handleInputChange('giftAmount', value)}
                      placeholder="Ï¶ùÏó¨?òÎäî Ï¥??¨ÏÇ∞Í∞Ä??
                      limit={GIFT_TAX_LIMITS_2024.maxGiftAmount}
                      // Í∏∞Ï°¥ Í≥ÑÏÇ∞Í∏??∏Ìôò???†Ï?

                      helpMessage={GIFT_TAX_LIMITS_2024.messages.relationshipDeduction}
                      required={true}
                      requiredMessage="Ï¶ùÏó¨??Í≥ÑÏÇ∞???ÑÌï¥ Ï¥?Ï¶ùÏó¨?¨ÏÇ∞ ?ÖÎ†•???ÑÏàò?ÖÎãà??
                      dynamicInfo={(value) => {
                        if (value === 0) return '';
                        
                        // Í¥ÄÍ≥ÑÎ≥Ñ Í≥µÏ†ú ?úÎèÑ ?ïÏù∏
                        const relationshipLimit = GIFT_TAX_LIMITS_2024.relationshipLimits;
                        let applicableLimit = 0;
                        let relationshipName = '';
                        
                        switch (input.donorRelation) {
                          case 'spouse':
                            applicableLimit = relationshipLimit.spouse.annual;
                            relationshipName = 'Î∞∞Ïö∞??;
                            break;
                          case 'parent':
                          case 'grandparent':
                            applicableLimit = relationshipLimit.linealAscendant.annual;
                            if (input.isRecipientMinor) {
                              applicableLimit += relationshipLimit.linealDescendant.minorBonus;
                            }
                            relationshipName = 'ÏßÅÍ≥ÑÏ°¥ÏÜç';
                            break;
                          case 'child':
                          case 'grandchild':
                            applicableLimit = relationshipLimit.linealDescendant.annual;
                            relationshipName = 'ÏßÅÍ≥ÑÎπÑÏÜç';
                            break;
                          default:
                            applicableLimit = relationshipLimit.other.annual;
                            relationshipName = 'Í∏∞Ì?';
                        }
                        
                        if (value <= applicableLimit) {
                          return `${relationshipName} Í¥ÄÍ≥ÑÎ°ú ${applicableLimit.toLocaleString()}?êÍπåÏßÄ Í≥µÏ†ú Í∞Ä?•Ìï©?àÎã§.`;
                        } else if (value <= 100000000) {
                          return `Í≥µÏ†ú ?úÎèÑ Ï¥àÍ≥ºÎ°?Ï¶ùÏó¨??10%Í∞Ä ?ÅÏö©?©Îãà??`;
                        } else if (value <= 500000000) {
                          return `Ï¶ùÏó¨??20%Í∞Ä ?ÅÏö©?©Îãà?? Î∂ÑÌï†Ï¶ùÏó¨Î•?Í≥†Î†§?¥Î≥¥?∏Ïöî.`;
                        } else if (value <= 1000000000) {
                          return `Ï¶ùÏó¨??30%Í∞Ä ?ÅÏö©?©Îãà?? ?ÑÎ¨∏Í∞Ä ?ÅÎã¥??Í∂åÏû•?©Îãà??`;
                        } else {
                          return `?†Ô∏è Í≥†Ïï° Ï¶ùÏó¨Î°?ÏµúÎ? 50% ?∏Ïú® ?ÅÏö© Í∞Ä?? Î∞òÎìú???ÑÎ¨∏Í∞Ä ?ÅÎã¥ ?ÑÏöî!`;
                        }
                      }}
                    />
                    
                    <div className="space-y-2">
                      <Label htmlFor="giftDate">Ï¶ùÏó¨??/Label>
                      <Input
                        id="giftDate"
                        type="date"
                        value={input.giftDate}
                        onChange={(e) => handleInputChange('giftDate', e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                      />
                      <p className="text-sm text-gray-500">
                        ?πÔ∏è {GIFT_TAX_LIMITS_2024.messages.filingDeadline}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="giftType">Ï¶ùÏó¨?¨ÏÇ∞ ?†Ìòï</Label>
                      <Select 
                        value={input.giftType} 
                        onValueChange={(value: any) => handleInputChange('giftType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Ï¶ùÏó¨?¨ÏÇ∞ ?†Ìòï ?†ÌÉù" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="money">?ÑÍ∏à¬∑?àÍ∏à</SelectItem>
                          <SelectItem value="realEstate">Î∂Ä?ôÏÇ∞</SelectItem>
                          <SelectItem value="stock">Ï£ºÏãù¬∑Ï¶ùÍ∂å</SelectItem>
                          <SelectItem value="business">?¨ÏóÖ?©Ïûê??/SelectItem>
                          <SelectItem value="other">Í∏∞Ì??¨ÏÇ∞</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <Checkbox
                        id="isConditionalGift"
                        checked={input.isConditionalGift}
                        onCheckedChange={(checked) => handleInputChange('isConditionalGift', checked)}
                      />
                      <Label htmlFor="isConditionalGift" className="font-medium">Î∂Ä?¥Î?Ï¶ùÏó¨</Label>
                      <Badge variant="outline" className="text-xs text-yellow-700">
                        Ï±ÑÎ¨¥?πÍ≥Ñ ??                      </Badge>
                    </div>

                    {input.isConditionalGift && (
                      <NumberInput
                        label="Î∂Ä?¥Ïï°"
                        value={input.giftConditionValue}
                        onChange={(value) => handleInputChange('giftConditionValue', value)}
                        placeholder="?òÏ¶ù?êÍ? Î∂Ä?¥Ìïò??Ï±ÑÎ¨¥ ??
                        limit={input.giftAmount * 2}

                        helpMessage={GIFT_TAX_LIMITS_2024.conditionalGiftLimits.description}
                        dynamicInfo={(value) => {
                          if (value === 0) return '';
                          
                          const giftAmount = input.giftAmount;
                          const burdenRatio = value / giftAmount;
                          const netGift = giftAmount - value;
                          const minNetGift = giftAmount * GIFT_TAX_LIMITS_2024.conditionalGiftLimits.minGiftRatio;
                          
                          if (value >= giftAmount) {
                            return '?ö® Î∂Ä?¥Ïï°??Ï¶ùÏó¨?°Í≥º Í∞ôÍ±∞??Ï¥àÍ≥º?òÎ©¥ Ï¶ùÏó¨Î°??∏Ï†ïÎ∞õÏ? Î™ªÌï©?àÎã§.';
                          } else if (burdenRatio >= 0.8) {
                            return `?†Ô∏è Î∂Ä?¥ÎπÑ??${(burdenRatio * 100).toFixed(1)}%Î°?Ï¶ùÏó¨ ?∏Ï†ï??Î¨∏Ï†úÍ∞Ä ?àÏùÑ ???àÏäµ?àÎã§.`;
                          } else if (netGift < minNetGift) {
                            return `?†Ô∏è ?úÏ¶ù?¨Ïï°??20% ÎØ∏Îßå?ÖÎãà?? ÏµúÏÜå ${minNetGift.toLocaleString()}?êÏ? ?úÏ¶ù?¨Îêò?¥Ïïº ?©Îãà??`;
                          } else {
                            return `???§Ïßà Ï¶ùÏó¨?? ${netGift.toLocaleString()}??(Î∂Ä?¥ÎπÑ?? ${(burdenRatio * 100).toFixed(1)}%)`;
                          }
                        }}
                      />
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="parties" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <NumberInput
                        label="Ï¶ùÏó¨???òÏù¥"
                        value={input.donorAge}
                        onChange={(value) => handleInputChange('donorAge', value)}
                        placeholder="Ï¶ùÏó¨??Îß??òÏù¥"
                        unit="??
                        limit={GIFT_TAX_LIMITS_2024.ageRestrictions.maxAge}
                        helpMessage="Ï¶ùÏó¨?òÎäî ?¨Îûå??Îß??òÏù¥"
                        dynamicInfo={(value) => {
                          if (value === 0) return '';
                          if (value >= GIFT_TAX_LIMITS_2024.ageRestrictions.seniorAge) {
                            return `Í≥†Î†π??${GIFT_TAX_LIMITS_2024.ageRestrictions.seniorAge}???¥ÏÉÅ)Î°?Ï°∞Í∏∞ Ï¶ùÏó¨ ???àÏÑ∏ ?®Í≥ºÍ∞Ä ?ΩÎãà??`;
                          }
                          return 'Ï¶ùÏó¨?úÍ∏∞Í∞Ä Îπ†Î??òÎ°ù ÎØ∏Îûò Í∞ÄÏπ??ÅÏäπÎ∂ÑÏóê ?Ä???àÏÑ∏ ?®Í≥ºÍ∞Ä ?àÏäµ?àÎã§.';
                        }}
                      />

                      <NumberInput
                        label="?òÏ¶ù???òÏù¥"
                        value={input.recipientAge}
                        onChange={(value) => handleInputChange('recipientAge', value)}
                        placeholder="?òÏ¶ù??Îß??òÏù¥"
                        unit="??
                        limit={GIFT_TAX_LIMITS_2024.ageRestrictions.maxAge}
                        // ?òÏù¥ ?úÌïú ?ÅÏö©
                        helpMessage="Ï¶ùÏó¨Î∞õÎäî ?¨Îûå??Îß??òÏù¥ (?πÎ≥ÑÍ≥µÏ†ú Ï°∞Í±¥???ÅÌñ•)"
                        dynamicInfo={(value) => {
                          if (value === 0) return '';
                          
                          const messages = [];
                          
                          // ÎØ∏ÏÑ±???¨Î?
                          if (value < GIFT_TAX_LIMITS_2024.ageRestrictions.minorAge) {
                            messages.push(`??ÎØ∏ÏÑ±?ÑÏûêÎ°?Ï∂îÍ? ${GIFT_TAX_LIMITS_2024.relationshipLimits.linealDescendant.minorBonus.toLocaleString()}??Í≥µÏ†ú Í∞Ä??);
                          } else {
                            messages.push(`?±Ïù∏?ºÎ°ú Í∏∞Î≥∏ Í≥µÏ†úÎß??ÅÏö©`);
                          }
                          
                          // ÍµêÏú°Îπ?Í≥µÏ†ú Í∞Ä???¨Î?
                          if (value <= GIFT_TAX_LIMITS_2024.ageRestrictions.educationMaxAge) {
                            messages.push(`??ÍµêÏú°ÎπÑÍ≥µ??Í∞Ä??${GIFT_TAX_LIMITS_2024.ageRestrictions.educationMaxAge}???¥Ìïò)`);
                          } else if (value <= GIFT_TAX_LIMITS_2024.ageRestrictions.startupMaxAge) {
                            messages.push(`?†Ô∏è ÍµêÏú°ÎπÑÍ≥µ??Î∂àÍ?, Ï∞ΩÏóÖ?êÍ∏àÍ≥µÏ†ú??Í∞Ä??);
                          } else {
                            messages.push(`?†Ô∏è ÍµêÏú°ÎπÑÍ≥µ?? Ï∞ΩÏóÖ?êÍ∏àÍ≥µÏ†ú Î™®Îëê Î∂àÍ?`);
                          }
                          
                          return messages.join(' | ');
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="donorRelation">Ï¶ùÏó¨?êÏ???Í¥ÄÍ≥?/Label>
                      <Select 
                        value={input.donorRelation} 
                        onValueChange={(value: any) => handleInputChange('donorRelation', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Í¥ÄÍ≥??†ÌÉù" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="spouse">Î∞∞Ïö∞??(6?µÏõê Í≥µÏ†ú)</SelectItem>
                          <SelectItem value="parent">Î∂ÄÎ™?(5Ï≤úÎßå??Í≥µÏ†ú)</SelectItem>
                          <SelectItem value="grandparent">Ï°∞Î?Î™?(5Ï≤úÎßå??Í≥µÏ†ú)</SelectItem>
                          <SelectItem value="child">?êÎ? (5Ï≤úÎßå??Í≥µÏ†ú)</SelectItem>
                          <SelectItem value="grandchild">?êÏûê?Ä (5Ï≤úÎßå??Í≥µÏ†ú)</SelectItem>
                          <SelectItem value="other">Í∏∞Ì? (1Ï≤úÎßå??Í≥µÏ†ú)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500">
                        ?πÔ∏è Í¥ÄÍ≥ÑÏóê ?∞Îùº Í≥µÏ†ú?°Ïù¥ ?¨ÎùºÏßëÎãà??
                      </p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isRecipientDisabled"
                          checked={input.isRecipientDisabled}
                          onCheckedChange={(checked) => handleInputChange('isRecipientDisabled', checked)}
                        />
                        <Label htmlFor="isRecipientDisabled">?•Ïï†??/Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isNonResident"
                          checked={input.isNonResident}
                          onCheckedChange={(checked) => handleInputChange('isNonResident', checked)}
                        />
                        <Label htmlFor="isNonResident">ÎπÑÍ±∞Ï£ºÏûê</Label>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="assets" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <NumberInput
                      label="?ÑÍ∏à¬∑?àÍ∏à"
                      value={input.cash}
                      onChange={(value) => handleInputChange('cash', value)}
                      placeholder="?ÑÍ∏à, ?àÏ†ÅÍ∏???
                    />
                    
                    <NumberInput
                      label="Î∂Ä?ôÏÇ∞"
                      value={input.realEstate}
                      onChange={(value) => handleInputChange('realEstate', value)}
                      placeholder="?†Ï?, Í±¥Î¨º ??
                    />
                    
                    <NumberInput
                      label="Ï£ºÏãù¬∑Ï¶ùÍ∂å"
                      value={input.stock}
                      onChange={(value) => handleInputChange('stock', value)}
                      placeholder="?ÅÏû•Ï£ºÏãù, ÎπÑÏÉÅ?•Ï£º????
                    />
                    
                    <NumberInput
                      label="Ï±ÑÍ∂å"
                      value={input.bond}
                      onChange={(value) => handleInputChange('bond', value)}
                      placeholder="Íµ?≥µÏ±? ?åÏÇ¨Ï±???
                    />
                    
                    <NumberInput
                      label="?¨ÏóÖ?©Ïûê??
                      value={input.businessAsset}
                      onChange={(value) => handleInputChange('businessAsset', value)}
                      placeholder="?¨ÏóÖ?? Í∏∞Í≥Ñ?§ÎπÑ ??
                    />
                    
                    <NumberInput
                      label="Í∏∞Ì??¨ÏÇ∞"
                      value={input.other}
                      onChange={(value) => handleInputChange('other', value)}
                      placeholder="Í≥®ÌîÑ?åÏõêÍ∂? ?àÏà†????
                    />
                  </div>
                </TabsContent>

                <TabsContent value="special" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center space-x-2 p-3 bg-pink-50 border border-pink-200 rounded-lg">
                      <Checkbox
                        id="marriageGift"
                        checked={input.marriageGift}
                        onCheckedChange={(checked) => handleInputChange('marriageGift', checked)}
                      />
                      <Label htmlFor="marriageGift" className="font-medium">?ºÏù∏Ï¶ùÏó¨</Label>
                      <Badge variant="outline" className="text-xs text-pink-700">
                        ÏµúÎ? 1?µÏõê Í≥µÏ†ú
                      </Badge>
                    </div>

                    {input.marriageGift && (
                      <NumberInput
                        label="?ºÏù∏Ï¶ùÏó¨ Í∏àÏï°"
                        value={input.marriageGiftAmount}
                        onChange={(value) => handleInputChange('marriageGiftAmount', value)}
                        placeholder="?ºÏù∏ ??Ï¶ùÏó¨Î∞õÏ? Í∏àÏï°"
                        limit={
                          input.donorRelation === 'child' || input.donorRelation === 'grandchild' 
                            ? GIFT_TAX_LIMITS_2024.specialDeductionLimits.marriage.child
                            : GIFT_TAX_LIMITS_2024.specialDeductionLimits.marriage.otherLineal
                        }
                        // ?ºÏù∏ Ï¶ùÏó¨ ?πÎ≥Ñ Í≥µÏ†ú

                        helpMessage={GIFT_TAX_LIMITS_2024.specialDeductionLimits.marriage.description}
                        dynamicInfo={(value) => {
                          if (value === 0) return '';
                          
                          const isChild = input.donorRelation === 'child' || input.donorRelation === 'grandchild';
                          const limit = isChild 
                            ? GIFT_TAX_LIMITS_2024.specialDeductionLimits.marriage.child
                            : GIFT_TAX_LIMITS_2024.specialDeductionLimits.marriage.otherLineal;
                          
                          if (value > limit) {
                            return `?†Ô∏è ${isChild ? '?êÎ?' : 'Í∏∞Ì? ÏßÅÍ≥ÑÎπÑÏÜç'} ?ºÏù∏Ï¶ùÏó¨Í≥µÏ†ú ?úÎèÑ(${limit.toLocaleString()}??Î•?Ï¥àÍ≥º?àÏäµ?àÎã§.`;
                          }
                          
                          const remaining = limit - value;
                          return `${isChild ? '?êÎ?' : 'Í∏∞Ì? ÏßÅÍ≥ÑÎπÑÏÜç'} ?ºÏù∏Ï¶ùÏó¨Í≥µÏ†ú ${remaining.toLocaleString()}???®Ïùå (?âÏÉù 1???úÏ†ï)`;
                        }}
                      />
                    )}

                    <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <Checkbox
                        id="educationGift"
                        checked={input.educationGift}
                        onCheckedChange={(checked) => handleInputChange('educationGift', checked)}
                      />
                      <Label htmlFor="educationGift" className="font-medium">ÍµêÏú°ÎπÑÏ¶ù??/Label>
                      <Badge variant="outline" className="text-xs text-blue-700">
                        Íµ?Ç¥ 3Ï≤úÎßå?? ?¥Ïô∏ 5Ï≤úÎßå??Í≥µÏ†ú
                      </Badge>
                      {input.recipientAge > GIFT_TAX_LIMITS_2024.ageRestrictions.educationMaxAge && (
                        <Badge variant="destructive" className="text-xs">
                          ?òÏù¥ ?úÌïú Ï¥àÍ≥º
                        </Badge>
                      )}
                    </div>

                    {input.educationGift && (
                      <NumberInput
                        label="ÍµêÏú°Îπ?Í∏àÏï°"
                        value={input.educationGiftAmount}
                        onChange={(value) => handleInputChange('educationGiftAmount', value)}
                        placeholder="ÍµêÏú°ÎπÑÎ°ú Ï¶ùÏó¨Î∞õÏ? Í∏àÏï°"
                        limit={GIFT_TAX_LIMITS_2024.specialDeductionLimits.education.foreign} // ?¥Ïô∏ Í∏∞Ï? ÏµúÎ?
                        // ÍµêÏú°Îπ??πÎ≥Ñ Í≥µÏ†ú

                        helpMessage={GIFT_TAX_LIMITS_2024.specialDeductionLimits.education.description}
                        dynamicInfo={(value) => {
                          if (value === 0) return '';
                          
                          const domesticLimit = GIFT_TAX_LIMITS_2024.specialDeductionLimits.education.domestic;
                          const foreignLimit = GIFT_TAX_LIMITS_2024.specialDeductionLimits.education.foreign;
                          const ageLimit = GIFT_TAX_LIMITS_2024.specialDeductionLimits.education.ageLimit;
                          
                          if (input.recipientAge > ageLimit) {
                            return `?ö® ?òÏ¶ù?êÍ? ${ageLimit}?∏Î? Ï¥àÍ≥º?òÏó¨ ÍµêÏú°ÎπÑÍ≥µ?úÎ? Î∞õÏùÑ ???ÜÏäµ?àÎã§.`;
                          }
                          
                          if (value <= domesticLimit) {
                            return `??Íµ?Ç¥ ÍµêÏú°Îπ?Í≥µÏ†ú Î≤îÏúÑ (${(domesticLimit - value).toLocaleString()}???®Ïùå)`;
                          } else if (value <= foreignLimit) {
                            return `???¥Ïô∏ ÍµêÏú°Îπ?Í≥µÏ†ú Î≤îÏúÑ (${(foreignLimit - value).toLocaleString()}???®Ïùå)`;
                          } else {
                            return `?†Ô∏è ÍµêÏú°ÎπÑÍ≥µ???úÎèÑ(?¥Ïô∏ ${foreignLimit.toLocaleString()}??Î•?Ï¥àÍ≥º?àÏäµ?àÎã§.`;
                          }
                        }}
                      />
                    )}

                    <div className="space-y-3">
                      <Label className="text-base font-medium">Í∞êÎ©¥ ?úÌÉù</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="familyBusinessDiscount"
                            checked={input.familyBusinessDiscount}
                            onCheckedChange={(checked) => handleInputChange('familyBusinessDiscount', checked)}
                          />
                          <Label htmlFor="familyBusinessDiscount">Í∞ÄÏ°±Í∏∞??Í∞êÎ©¥</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="farmLandDiscount"
                            checked={input.farmLandDiscount}
                            onCheckedChange={(checked) => handleInputChange('farmLandDiscount', checked)}
                          />
                          <Label htmlFor="farmLandDiscount">?çÏ? Í∞êÎ©¥</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="culturalAssetDiscount"
                            checked={input.culturalAssetDiscount}
                            onCheckedChange={(checked) => handleInputChange('culturalAssetDiscount', checked)}
                          />
                          <Label htmlFor="culturalAssetDiscount">Î¨∏Ìôî??Í∞êÎ©¥</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="startupDiscount"
                            checked={input.startupDiscount}
                            onCheckedChange={(checked) => handleInputChange('startupDiscount', checked)}
                          />
                          <Label htmlFor="startupDiscount">Ï∞ΩÏóÖ?êÍ∏à Í∞êÎ©¥</Label>
                        </div>
                      </div>
                    </div>

                    <NumberInput
                      label="Í∏∞ÎÇ©Î∂Ä Ï¶ùÏó¨??
                      value={input.previousTaxPaid}
                      onChange={(value) => handleInputChange('previousTaxPaid', value)}
                      placeholder="?¥Ï†Ñ???©Î???Ï¶ùÏó¨??
                      helpMessage="?ôÏùº Ï¶ùÏó¨???Ä??Í∏∞ÎÇ©Î∂Ä?∏Ïï°"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Ï§ëÏöî Í≤ΩÍ≥† Î©îÏãúÏßÄ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="w-5 h-5" />
                ?†Ô∏è Ï§ëÏöî Ï£ºÏùò?¨Ìï≠
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {input.giftAmount > 100000000 && (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>{GIFT_TAX_LIMITS_2024.warnings.excessiveAmount}</strong>
                    <br />Î∂ÑÌï†Ï¶ùÏó¨Î•??µÌï¥ ?∏Ïú® Î∂Ä?¥ÏùÑ Ï§ÑÏùº ???àÏäµ?àÎã§.
                  </AlertDescription>
                </Alert>
              )}
              
              {input.previousGifts.length > 0 && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <Info className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <strong>{GIFT_TAX_LIMITS_2024.warnings.cumulativeRisk}</strong>
                    <br />10????Ï¶ùÏó¨ ?¥Î†•: {input.previousGifts.length}Í±?                  </AlertDescription>
                </Alert>
              )}
              
              {input.isConditionalGift && input.giftConditionValue / input.giftAmount > 0.7 && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>{GIFT_TAX_LIMITS_2024.warnings.conditionalGift}</strong>
                    <br />Î∂Ä?¥ÎπÑ?? {((input.giftConditionValue / input.giftAmount) * 100).toFixed(1)}%
                  </AlertDescription>
                </Alert>
              )}
              
              {(input.marriageGift || input.educationGift || input.startupDiscount) && (
                <Alert className="border-purple-200 bg-purple-50">
                  <Info className="h-4 w-4 text-purple-600" />
                  <AlertDescription className="text-purple-800">
                    <strong>{GIFT_TAX_LIMITS_2024.warnings.specialRequirements}</strong>
                    <br />?πÎ≥ÑÍ≥µÏ†ú ?†Ï≤≠ ???îÍ±¥ Ï∂©Ï°± ?¨Î?Î•??¨Ï†Ñ???ïÏù∏?òÏÑ∏??
                  </AlertDescription>
                </Alert>
              )}
              
              <Alert className="border-blue-200 bg-blue-50">
                <Clock className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>{GIFT_TAX_LIMITS_2024.warnings.filingRequired}</strong>
                  <br />Ï¶ùÏó¨?? {input.giftDate} ???†Í≥†Í∏∞Ìïú: {new Date(new Date(input.giftDate).getTime() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR')}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* ?àÏÑ∏ Ï°∞Ïñ∏ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <PiggyBank className="w-5 h-5" />
                ?í° ?àÏÑ∏ ?ÑÎûµ Ï°∞Ïñ∏
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h4 className="font-medium text-green-800 mb-2">?ìÖ Î∂ÑÌï†Ï¶ùÏó¨ ?ÑÎûµ</h4>
                <p className="text-sm text-green-700">
                  {GIFT_TAX_LIMITS_2024.messages.taxSaving}
                </p>
                {input.donorRelation && (
                  <p className="text-xs text-green-600 mt-1">
                    ?ÑÏû¨ Í¥ÄÍ≥??∞Í∞Ñ ?úÎèÑ: {
                      input.donorRelation === 'spouse' ? GIFT_TAX_LIMITS_2024.relationshipLimits.spouse.annual :
                      ['parent', 'grandparent'].includes(input.donorRelation) ? GIFT_TAX_LIMITS_2024.relationshipLimits.linealAscendant.annual :
                      ['child', 'grandchild'].includes(input.donorRelation) ? GIFT_TAX_LIMITS_2024.relationshipLimits.linealDescendant.annual :
                      GIFT_TAX_LIMITS_2024.relationshipLimits.other.annual
                    }??                  </p>
                )}
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-blue-800 mb-2">??Ï¶ùÏó¨ ?Ä?¥Î∞ç</h4>
                <p className="text-sm text-blue-700">
                  {GIFT_TAX_LIMITS_2024.messages.timing}
                </p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <h4 className="font-medium text-purple-800 mb-2">?ìà ?ÑÏßÑ?∏Ïú® ?åÌîº</h4>
                <p className="text-sm text-purple-700">
                  {GIFT_TAX_LIMITS_2024.messages.progressiveRate}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2 rounded">
                    <span className="font-medium">1?µÏõê ?¥Ìïò:</span> 10%
                  </div>
                  <div className="bg-white p-2 rounded">
                    <span className="font-medium">5?µÏõê ?¥Ìïò:</span> 20%
                  </div>
                  <div className="bg-white p-2 rounded">
                    <span className="font-medium">10?µÏõê ?¥Ìïò:</span> 30%
                  </div>
                  <div className="bg-white p-2 rounded">
                    <span className="font-medium">30?µÏõê Ï¥àÍ≥º:</span> 50%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ?§Î•ò ?úÏãú */}
          {Object.keys(errors).length > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Í≤∞Í≥º ?ÅÏó≠ */}
        <div className="space-y-6">
          {result && (
            <>
              {/* Í≥ÑÏÇ∞ Í≤∞Í≥º ?îÏïΩ */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-purple-600" />
                    Ï¶ùÏó¨??Í≥ÑÏÇ∞ Í≤∞Í≥º
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600 mb-1">Ï¥?Ï¶ùÏó¨?¨ÏÇ∞</p>
                      <p className="text-xl font-bold text-blue-800">
                        {result.grossGift.toLocaleString()}??                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600 mb-1">Í≥µÏ†ú??/p>
                      <p className="text-xl font-bold text-green-800">
                        {result.giftDeductions.toLocaleString()}??                      </p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-600 mb-1">Í≥ºÏÑ∏?úÏ?</p>
                      <p className="text-xl font-bold text-orange-800">
                        {result.taxableGift.toLocaleString()}??                      </p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-600 mb-1">ÏµúÏ¢Ö ?©Î??∏Ïï°</p>
                      <p className="text-2xl font-bold text-red-800">
                        {result.determinedTax.toLocaleString()}??                      </p>
                    </div>
                  </div>

                  {result.cumulativeTaxation.previousGifts > 0 && (
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <Info className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800">
                        <strong>?ìä 10???©ÏÇ∞Í≥ºÏÑ∏ ?ÅÏö©:</strong><br />
                                                  ??Í∏∞Ï°¥ Ï¶ùÏó¨?? {Math.round(result.cumulativeTaxation.previousGifts).toLocaleString('ko-KR')}??br />
                          ???¥Î≤à Ï¶ùÏó¨?? {Math.round(result.cumulativeTaxation.currentGift).toLocaleString('ko-KR')}??br />
                          ??Ï¥??©ÏÇ∞?? {Math.round(result.cumulativeTaxation.totalGifts).toLocaleString('ko-KR')}??br />
                          ??Í∏∞ÎÇ©Î∂Ä ?∏Ïï°: {Math.round(result.cumulativeTaxation.previousTaxPaid).toLocaleString('ko-KR')}??                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">?§Ìö®?∏Ïú®</span>
                      <span className="text-lg font-bold">
                        {(result.effectiveRate * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">?ÅÏö©?∏Ïú®</span>
                      <span className="text-lg font-bold">
                        {(result.marginalRate * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Í≥µÏ†ú ?ÅÏÑ∏ */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-green-600" />
                    Í≥µÏ†ú ?ÅÏÑ∏
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>{result.relationshipDeduction.type}</span>
                    <span className="font-medium">
                      {result.relationshipDeduction.amount.toLocaleString()}??                    </span>
                  </div>
                  
                  {result.specialDeductions.marriage > 0 && (
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>?ºÏù∏Ï¶ùÏó¨Í≥µÏ†ú</span>
                      <span className="font-medium">
                        {result.specialDeductions.marriage.toLocaleString()}??                      </span>
                    </div>
                  )}
                  
                  {result.specialDeductions.education > 0 && (
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>ÍµêÏú°ÎπÑÍ≥µ??/span>
                      <span className="font-medium">
                        {result.specialDeductions.education.toLocaleString()}??                      </span>
                    </div>
                  )}
                  
                  {result.specialDeductions.startup > 0 && (
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Ï∞ΩÏóÖ?êÍ∏àÍ≥µÏ†ú</span>
                      <span className="font-medium">
                        {result.specialDeductions.startup.toLocaleString()}??                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-2 font-bold text-lg">
                    <span>Ï¥?Í≥µÏ†ú??/span>
                    <span className="text-green-600">
                      {result.giftDeductions.toLocaleString()}??                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* ?†Í≥† Î∞??©Î? ?àÎÇ¥ */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    ?†Í≥† Î∞??©Î? ?àÎÇ¥
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>?†Í≥†Í∏∞Ìïú</span>
                    <span className="font-medium">
                      {result.filingDueDate.toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>?©Î?Í∏∞Ìïú</span>
                    <span className="font-medium">
                      {result.paymentDueDate.toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  
                  {result.installmentAvailable && (
                    <Alert className="border-blue-200 bg-blue-50">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        <strong>Î∂ÑÌï†?©Î? Í∞Ä??</strong> 200ÎßåÏõê ?¥ÏÉÅ?ºÎ°ú ÏµúÎ? 5??Î∂ÑÌï†?©Î?Í∞Ä Í∞Ä?•Ìï©?àÎã§.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <p className="text-sm text-gray-500 border-t pt-3">
                    ?πÔ∏è {GIFT_TAX_LIMITS_2024.messages.filingDeadline}
                  </p>
                </CardContent>
              </Card>

              {/* ?àÏÑ∏ Ï°∞Ïñ∏ */}
              {result.taxSavingAdvice.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PiggyBank className="w-5 h-5 text-yellow-600" />
                      ?í∞ ÎßûÏ∂§???àÏÑ∏ Ï°∞Ïñ∏
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {result.taxSavingAdvice.map((advice, index) => (
                      <Alert key={index} className="border-green-200 bg-green-50">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          <strong>?éØ {advice.type}:</strong><br />
                          {advice.description}
                          {advice.expectedSaving > 0 && (
                            <div className="mt-2 p-2 bg-green-100 rounded border">
                              <span className="font-medium text-green-900">
                                ?íµ ?àÏÉÅ ?àÏÑ∏?? {advice.expectedSaving.toLocaleString()}??                              </span>
                            </div>
                          )}
                        </AlertDescription>
                      </Alert>
                    ))}
                    
                    {/* Ï∂îÍ? ?àÏÑ∏ ?ÑÎûµ */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-bold text-blue-900 mb-3">?? Ï∂îÍ? ?àÏÑ∏ ?ÑÎûµ</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded border">
                          <h5 className="font-medium text-blue-800 mb-1">?ìÖ ?∞ÎèÑÎ≥?Î∂ÑÌï†Ï¶ùÏó¨</h5>
                          <p className="text-sm text-blue-700">
                            {input.donorRelation === 'spouse' ? 'Îß§ÎÖÑ 6?µÏõê?? :
                             ['parent', 'grandparent'].includes(input.donorRelation) ? 'Îß§ÎÖÑ 5Ï≤úÎßå?êÏî©' :
                             ['child', 'grandchild'].includes(input.donorRelation) ? 'Îß§ÎÖÑ 5Ï≤úÎßå?êÏî©' :
                             'Îß§ÎÖÑ 1Ï≤úÎßå?êÏî©'} Î∂ÑÌï†?òÏó¨ Ï¶ùÏó¨??Î∂Ä??ÏµúÏÜå??                          </p>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <h5 className="font-medium text-purple-800 mb-1">?éØ ?Ä?¥Î∞ç ÏµúÏ†Å??/h5>
                          <p className="text-sm text-purple-700">
                            ?¨ÏÇ∞ Í∞ÄÏπòÍ? ??? ?úÏ†ê??Ï¶ùÏó¨?òÏó¨ ÎØ∏Îûò ?ÅÏäπÎ∂??àÏÑ∏
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <h5 className="font-medium text-orange-800 mb-1">?è† Î∂Ä?ôÏÇ∞ ?ÑÎûµ</h5>
                          <p className="text-sm text-orange-700">
                            ?†Ï? Î®ºÏ? Ï¶ùÏó¨ ??Í±¥Î¨º ?†Ï∂ï?ºÎ°ú Í∞ÄÏπ??ÅÏäπÎ∂??åÌîº
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <h5 className="font-medium text-green-800 mb-1">?ë• Í∞ÄÏ°??®ÏúÑ Ï¶ùÏó¨</h5>
                          <p className="text-sm text-green-700">
                            Î∞∞Ïö∞?? ?êÎ? ???§Ïàò?êÍ≤å Î∂ÑÏÇ∞ Ï¶ùÏó¨Î°??ÑÏ≤¥ ?∏Î???Í∞êÏÜå
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {!result && (
            <Card>
              <CardContent className="text-center py-12">
                <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Ï¶ùÏó¨ ?ïÎ≥¥Î•??ÖÎ†•?òÎ©¥ Í≥ÑÏÇ∞ Í≤∞Í≥ºÍ∞Ä ?úÏãú?©Îãà??
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Ï¢ÖÌï© Ï°∞Ïñ∏ Î∞?Ï≤¥ÌÅ¨Î¶¨Ïä§??*/}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-600">
            <CheckCircle className="w-5 h-5" />
            ?ìã Ï¶ùÏó¨???†Í≥† Ï≤¥ÌÅ¨Î¶¨Ïä§??          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ?†Í≥† ??Ï§ÄÎπÑÏÇ¨??*/}
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 mb-3">?ìù ?†Í≥† ??Ï§ÄÎπÑÏÇ¨??/h4>
              <div className="space-y-2">
                {[
                  'Ï¶ùÏó¨Í≥ÑÏïΩ???êÎäî Ï¶ùÏó¨?ïÏù∏???ëÏÑ±',
                  'Î∂Ä?ôÏÇ∞??Í≤ΩÏö∞ ?±Í∏∞Î∂Ä?±Î≥∏ Î∞?Í≥µÏãúÏßÄÍ∞Ä ?ïÏù∏',
                  'Ï£ºÏãù??Í≤ΩÏö∞ Ï£ºÏ£ºÎ™ÖÎ? Î∞??âÍ?Î™ÖÏÑ∏??,
                  'Î∂Ä?¥Î?Ï¶ùÏó¨??Î∂Ä?¥ÎÇ¥??Î™ÖÏÑ∏??,
                  '?πÎ≥ÑÍ≥µÏ†ú ?îÍ±¥ Ï∂©Ï°± Ï¶ùÎπô?úÎ•ò',
                  'Í∏∞Ï°¥ Ï¶ùÏó¨???†Í≥†?úÎ•ò (10????',
                  '?†Î∂ÑÏ¶?Î∞?Í∞ÄÏ°±Í?Í≥ÑÏ¶ùÎ™ÖÏÑú'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* ?†Í≥† ??Ï£ºÏùò?¨Ìï≠ */}
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 mb-3">?†Ô∏è ?†Í≥† ??Ï£ºÏùò?¨Ìï≠</h4>
              <div className="space-y-2">
                {[
                  'Ï¶ùÏó¨?ºÎ°úÎ∂Ä??3Í∞úÏõî ?¥ÎÇ¥ ?†Í≥† ?ÑÏàò',
                  '?†Í≥† ?ÑÎùΩ ??20% Í∞Ä?∞ÏÑ∏ Î∂ÄÍ≥?,
                  '?πÎ≥ÑÍ≥µÏ†ú???†Í≥†?¥ÏïºÎß??ÅÏö©',
                  'Î∂Ä?¥Î?Ï¶ùÏó¨???ïÌôï??Î∂Ä?¥Ïï° ?∞Ï†ï',
                  '?¨ÏÇ∞ ?âÍ???Ï¶ùÏó¨??Í∏∞Ï? ?úÍ?',
                  '?∏Î¨¥??Î∞©Î¨∏ ?êÎäî ?àÌÉù???®Îùº???†Í≥†',
                  '?©Î????†Í≥†?Ä ?ôÏãú???ÑÎ£å'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* ?∞ÎùΩÏ≤??ïÎ≥¥ */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-3">?ìû ?ÑÏ?Î∞õÏùÑ ???àÎäî Í≥?/h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium text-blue-800">Íµ?Ñ∏Ï≤?ÏΩúÏÑº??/div>
                <div className="text-blue-600">126</div>
                <div className="text-xs text-blue-500">24?úÍ∞Ñ ?ÅÎã¥</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-green-800">?àÌÉù??/div>
                <div className="text-green-600">hometax.go.kr</div>
                <div className="text-xs text-green-500">?®Îùº???†Í≥†</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-purple-800">?ÑÎ¨∏ ?∏Î¨¥??/div>
                <div className="text-purple-600">Í∞úÏù∏ ?ÅÎã¥</div>
                <div className="text-xs text-purple-500">Î≥µÏû°???¨Ïïà</div>
              </div>
            </div>
          </div>
          
          {/* ÏµúÏ¢Ö ?åÎ¶º */}
          <Alert className="mt-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>?ö® Ï§ëÏöî ?àÎÇ¥:</strong><br />
              Î≥?Í≥ÑÏÇ∞ Í≤∞Í≥º??Ï∞∏Í≥†?©Ïù¥Î©? ?§Ï†ú ?†Í≥† ?úÏóê??Î∞òÎìú???∏Î¨¥ ?ÑÎ¨∏Í∞Ä??Í≤Ä?†Î? Î∞õÏúº?úÍ∏∞ Î∞îÎûç?àÎã§.
              Í∞úÏù∏Î≥??πÏàò ?ÅÌô©?¥ÎÇò ÏµúÏã† ?∏Î≤ï Î≥ÄÍ≤ΩÏÇ¨??ù¥ Î∞òÏòÅ?òÏ? ?äÏùÑ ???àÏäµ?àÎã§.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* ?ß™ Î≤†Ì??åÏä§???ºÎìúÎ∞??úÏä§??(Î©¥Ï±ÖÏ°∞Ìï≠ ?ÅÎã®) */}
        calculatorName="Ï¶ùÏó¨??Í≥ÑÏÇ∞Í∏?
        className="mb-6"
      />

      {/* ?òÎã® Î©¥Ï±Ö Ï°∞Ìï≠ */}
      <TaxCalculatorDisclaimer variant="full" className="mt-8" />
    </div>
  );
} 
