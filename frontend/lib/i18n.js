import { languages as langList, extendedTranslations } from './i18n-extended'

export const languages = langList

export const dict = {
  en: {
    'home.title': 'Track Your District Performance',
    'home.orSelect': 'or select manually',
    'location.finding': 'Finding your location...',
    'location.selectPrompt': 'Please select your district',
    'location.isThisYourDistrict': 'Is this your district?',
    'yes': 'Yes',
    'no': 'No',
    'state': 'State',
    'selectDistrict': 'Select District',
    'viewDashboard': 'View Dashboard',
    'changeDistrict': 'Change District',
    'lastUpdated': 'Last updated',
    'metrics.totalFamilies': 'Total Families Worked',
    'metrics.avgDays': 'Average Days of Work',
    'metrics.totalSpent': 'Total Money Spent',
    'metrics.completedWorks': 'Works Completed',
    'charts.last12Months': 'Household Employment Trend',
    'charts.monthlyExpenditure': 'Monthly Expenditure',
    'gauge.workCompletionRate': 'Work Completion Rate',
    'compare.title': 'District Performance Rankings',
    'details.viewMore': 'More Info',
    'details.scPersondays': 'SC Persondays',
    'details.stPersondays': 'ST Persondays',
    'details.womenPersondays': 'Women Persondays',
    'details.hh100Days': '100 Days Households',
    'manualSelection.available': 'Manual selection available below',
    'table.rank': 'Rank',
    'table.district': 'District',
    'table.households': 'Households',
    'table.vsYou': 'Vs You',
    'table.similar': 'Similar Districts',
    'loading': 'Loading...'
  },
  hi: {
    'home.title': 'अपने जिले का प्रदर्शन ट्रैक करें',
    'home.orSelect': 'या मैन्युअली चुनें',
    'location.finding': 'आपका स्थान खोज रहे हैं...',
    'location.selectPrompt': 'कृपया अपना जिला चुनें',
    'location.isThisYourDistrict': 'क्या यह आपका जिला है?',
    'yes': 'हाँ',
    'no': 'नहीं',
    'state': 'राज्य',
    'selectDistrict': 'जिला चुनें',
    'viewDashboard': 'डैशबोर्ड देखें',
    'changeDistrict': 'जिला बदलें',
    'lastUpdated': 'अंतिम अपडेट',
    'metrics.totalFamilies': 'कुल परिवारों को रोजगार',
    'metrics.avgDays': 'औसत रोजगार दिवस',
    'metrics.totalSpent': 'कुल व्यय',
    'metrics.completedWorks': 'पूर्ण कार्य',
    'charts.last12Months': 'परिवार रोजगार रुझान',
    'charts.monthlyExpenditure': 'मासिक व्यय',
    'gauge.workCompletionRate': 'कार्य पूर्णता दर',
    'compare.title': 'जिला प्रदर्शन रैंकिंग',
    'details.viewMore': 'अधिक जानकारी',
    'details.scPersondays': 'SC कार्य-दिवस',
    'details.stPersondays': 'ST कार्य-दिवस',
    'details.womenPersondays': 'महिला कार्य-दिवस',
    'details.hh100Days': '100 दिन पूर्ण करने वाले परिवार',
    'manualSelection.available': 'नीचे मैन्युअल चयन उपलब्ध है',
    'table.rank': 'रैंक',
    'table.district': 'जिला',
    'table.households': 'परिवार',
    'table.vsYou': 'आपके मुकाबले',
    'table.similar': 'समान जिले',
    'loading': 'लोड हो रहा है...'
  }
}

// Merge extended translations
Object.keys(extendedTranslations).forEach(lang => {
  dict[lang] = extendedTranslations[lang]
})

export function t(key, lang='en') {
  return (dict[lang] && dict[lang][key]) || (dict.en[key]) || key
}

export function relativeTimeLocalized(date, lang='en'){
  if(!date) return ''
  const d = new Date(date)
  const diff = Date.now() - d.getTime()
  const h = Math.floor(diff/3600000)
  if(h < 1){
    const m = Math.floor(diff/60000)
    return lang==='hi' ? `${m} मिनट पहले` : `${m} min ago`
  }
  return lang==='hi' ? `${h} घंटे पहले` : `${h} hours ago`
}
