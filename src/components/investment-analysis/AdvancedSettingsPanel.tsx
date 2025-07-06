'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Settings, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  DollarSign, 
  Calculator,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Info,
  RotateCcw
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface AdvancedSettings {
  revenueGrowthRate: number
  costInflationRate: number
  debtRatio: number
  interestRate: number // 이자율 (대출 비용 계산용)
  additionalLoanRate: number
  workingCapitalRatio: number
  depreciationRate: number
  residualValue: number
  inflationRate: number
  corporateTaxRate: number
  enableScenarioAnalysis: boolean
  pessimisticAdjustment: number
  optimisticAdjustment: number
  selectedScenario: 'pessimistic' | 'neutral' | 'optimistic'
  scenarioAdjustment: number
}

interface AdvancedSettingsPanelProps {
  settings: AdvancedSettings
  onSettingsChange: (settings: AdvancedSettings) => void
  onReset: () => void
}

export default function AdvancedSettingsPanel({ 
  settings, 
  onSettingsChange, 
  onReset 
}: AdvancedSettingsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState('growth')

  const handleSettingChange = (key: keyof AdvancedSettings, value: number | boolean) => {
    onSettingsChange({
      ...settings,
      [key]: value
    })
  }

  const resetToDefaults = () => {
    onReset()
    setIsExpanded(false)
  }

  const settingGroups = {
    growth: {
      title: '성장 및 인플레이션',
      icon: TrendingUp,
      color: 'text-green-600',
      settings: [
        {
          key: 'revenueGrowthRate' as keyof AdvancedSettings,
          label: '매출성장률',
          unit: '%',
          min: -10,
          max: 100,
          step: 0.5,
          description: '연간 매출 CAGR증가율'
        },
        {
          key: 'costInflationRate' as keyof AdvancedSettings,
          label: '비용상승률',
          unit: '%',
          min: 0,
          max: 20,
          step: 0.5,
          description: '연간 운영비용 상승률'
        },
        {
          key: 'inflationRate' as keyof AdvancedSettings,
          label: '인플레이션율',
          unit: '%',
          min: 0,
          max: 10,
          step: 0.1,
          description: '경제 전반의 물가상승률'
        }
      ]
    },
    finance: {
      title: '재무 구조',
      icon: DollarSign,
      color: 'text-blue-600',
      settings: [
        {
          key: 'debtRatio' as keyof AdvancedSettings,
          label: '부채비율',
          unit: '%',
          min: 0,
          max: 500,
          step: 1,
          description: '총 자산 대비 부채 비율'
        },
        {
          key: 'interestRate' as keyof AdvancedSettings,
          label: '이자율 (대출금리)',
          unit: '%',
          min: 0.5,
          max: 15,
          step: 0.1,
          description: '정책자금 대출 이자율 (대출 비용 계산용, 0.1% 단위)'
        },
        {
          key: 'additionalLoanRate' as keyof AdvancedSettings,
          label: '추가대출금리',
          unit: '%',
          min: 0,
          max: 15,
          step: 0.1,
          description: '정책자금 외 추가 대출 금리'
        },
        {
          key: 'workingCapitalRatio' as keyof AdvancedSettings,
          label: '운전자본비율',
          unit: '%',
          min: 0,
          max: 30,
          step: 0.5,
          description: '매출대비 운전자본 비율 (운전자본 = 매출채권 + 재고자산 - 매입채무)'
        },
        {
          key: 'corporateTaxRate' as keyof AdvancedSettings,
          label: '법인세율',
          unit: '%',
          min: 10,
          max: 35,
          step: 0.5,
          description: '적용될 법인세율'
        }
      ]
    },
    depreciation: {
      title: '감가상각 및 잔존가치',
      icon: Calculator,
      color: 'text-purple-600',
      settings: [
        {
          key: 'depreciationRate' as keyof AdvancedSettings,
          label: '감가상각률',
          unit: '%',
          min: 5,
          max: 33,
          step: 0.5,
          description: '연간 감가상각률 (정률법 적용시)'
        },
        {
          key: 'residualValue' as keyof AdvancedSettings,
          label: '잔존가치',
          unit: '억원',
          min: 0,
          max: 10,
          step: 0.1,
          description: '분석기간 종료시 자산 잔존가치',
          isAmount: true
        }
      ]
    },
    scenario: {
      title: '시나리오 분석',
      icon: BarChart3,
      color: 'text-orange-600',
      settings: [
        {
          key: 'pessimisticAdjustment' as keyof AdvancedSettings,
          label: '비관적 조정률',
          unit: '%',
          min: -50,
          max: 0,
          step: 1,
          description: '비관적 시나리오 매출 조정률'
        },
        {
          key: 'optimisticAdjustment' as keyof AdvancedSettings,
          label: '낙관적 조정률',
          unit: '%',
          min: 0,
          max: 100,
          step: 1,
          description: '낙관적 시나리오 매출 조정률'
        },
        {
          key: 'scenarioAdjustment' as keyof AdvancedSettings,
          label: '선택 시나리오 조정률',
          unit: '%',
          min: -50,
          max: 100,
          step: 1,
          description: '선택한 시나리오의 조정률'
        }
      ]
    }
  }

  const SettingInput = ({ setting, value }: { setting: any, value: number }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">
            {setting.label}
          </label>
          <div className="group relative">
            <Info className="h-3 w-3 text-gray-400 cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {setting.description}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold text-gray-900">
            {setting.isAmount ? (value * 100000000 / 100000000).toFixed(1) : value.toFixed(1)}
          </span>
          <span className="text-xs text-gray-500">{setting.unit}</span>
        </div>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={setting.min}
          max={setting.max}
          step={setting.step}
          value={setting.isAmount ? value / 100000000 : value}
          onChange={(e) => handleSettingChange(
            setting.key, 
            setting.isAmount ? parseFloat(e.target.value) * 100000000 : parseFloat(e.target.value)
          )}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          aria-label={`${setting.label} 설정`}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{setting.isAmount ? (setting.min).toFixed(0) : setting.min}%</span>
          <span>{setting.isAmount ? (setting.max).toFixed(0) : setting.max}%</span>
        </div>
      </div>
    </div>
  )

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div 
        className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">고급 설정</h3>
              <p className="text-sm text-indigo-100">
                정밀한 투자분석을 위한 상세 변수 조정
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {Object.values(settings).filter(v => typeof v === 'number' && v !== 0).length}개 설정됨
            </Badge>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6">
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.entries(settingGroups).map(([key, group]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === key
                        ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <group.icon className={`h-4 w-4 ${group.color}`} />
                    {group.title}
                  </button>
                ))}
              </div>

              {/* Settings Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="grid gap-6">
                    {settingGroups[activeTab as keyof typeof settingGroups].settings.map((setting) => (
                      <SettingInput
                        key={setting.key}
                        setting={setting}
                        value={settings[setting.key] as number}
                      />
                    ))}
                  </div>

                  {/* Scenario Analysis Toggle */}
                  {activeTab === 'scenario' && (
                    <div className="pt-4 border-t space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <PieChart className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium">시나리오 분석 활성화</span>
                        </div>
                        <button
                          onClick={() => handleSettingChange('enableScenarioAnalysis', !settings.enableScenarioAnalysis)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.enableScenarioAnalysis ? 'bg-indigo-600' : 'bg-gray-200'
                          }`}
                          aria-label="시나리오 분석 활성화/비활성화"
                          title="시나리오 분석 활성화/비활성화"
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.enableScenarioAnalysis ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Scenario Selection */}
                      {settings.enableScenarioAnalysis && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Target className="h-4 w-4 text-orange-600" />
                              <span className="text-sm font-medium text-gray-700">시나리오 선택</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { key: 'pessimistic', label: '비관적', icon: '📉', color: 'border-red-300 text-red-700' },
                                { key: 'neutral', label: '중립적', icon: '📊', color: 'border-gray-300 text-gray-700' },
                                { key: 'optimistic', label: '낙관적', icon: '📈', color: 'border-green-300 text-green-700' }
                              ].map((scenario) => (
                                <button
                                  key={scenario.key}
                                  onClick={() => {
                                    handleSettingChange('selectedScenario', scenario.key as any);
                                    // 자동으로 해당 시나리오의 기본 조정률 설정
                                    if (scenario.key === 'pessimistic') {
                                      handleSettingChange('scenarioAdjustment', settings.pessimisticAdjustment);
                                    } else if (scenario.key === 'optimistic') {
                                      handleSettingChange('scenarioAdjustment', settings.optimisticAdjustment);
                                    } else {
                                      handleSettingChange('scenarioAdjustment', 0);
                                    }
                                  }}
                                  className={`p-3 border-2 rounded-lg text-center transition-all ${
                                    settings.selectedScenario === scenario.key
                                      ? `${scenario.color} bg-opacity-10 border-opacity-100`
                                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                  }`}
                                >
                                  <div className="text-lg mb-1">{scenario.icon}</div>
                                  <div className="text-xs font-medium">{scenario.label}</div>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Selected Scenario Info */}
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-gray-700 mb-2">
                              선택된 시나리오: <span className="capitalize">{settings.selectedScenario}</span>
                            </div>
                            <div className="text-xs text-gray-600">
                              {settings.selectedScenario === 'pessimistic' && '보수적 매출 예측으로 리스크를 고려한 분석'}
                              {settings.selectedScenario === 'neutral' && '현재 계획 기준의 중립적 분석'}
                              {settings.selectedScenario === 'optimistic' && '적극적 매출 예측으로 성장 가능성을 고려한 분석'}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-6 border-t mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetToDefaults}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  기본값으로 초기화
                </Button>
                
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Zap className="h-4 w-4" />
                  변경사항이 자동으로 반영됩니다
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </Card>
  )
} 