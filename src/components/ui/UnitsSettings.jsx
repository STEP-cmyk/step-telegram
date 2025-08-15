import React from 'react'
import { DollarSign, Scale, Ruler } from 'lucide-react'
import { useTranslation } from '../../lib/i18n'

export default function UnitsSettings({ units, onUnitsChange }) {
  const { t } = useTranslation()

  const handleUnitChange = (type, value) => {
    onUnitsChange({
      ...units,
      [type]: value
    })
  }

  return (
    <div className="space-y-6">
      {/* Currency */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <DollarSign size={20} className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              {t('currency')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('currencyDescription')}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'RUB', label: '₽ RUB', symbol: '₽' },
            { value: 'USD', label: '$ USD', symbol: '$' },
            { value: 'EUR', label: '€ EUR', symbol: '€' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleUnitChange('currency', option.value)}
              className={`p-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                units.currency === option.value
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {option.symbol}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {option.value}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Weight */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Scale size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              {t('weight')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('weightDescription')}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'kg', label: 'Kilograms (kg)' },
            { value: 'lb', label: 'Pounds (lb)' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleUnitChange('weight', option.value)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                units.weight === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <div className="text-center">
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {option.label}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Length */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Ruler size={20} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              {t('length')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('lengthDescription')}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'cm', label: 'Centimeters (cm)' },
            { value: 'ft', label: 'Feet & Inches (ft)' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleUnitChange('length', option.value)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                units.length === option.value
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <div className="text-center">
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {option.label}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
