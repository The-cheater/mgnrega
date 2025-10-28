// Simple explanations for MGNREGA metrics (for low-literacy users)
export const explanations = {
  Total_No_of_Workers: {
    en: "Total number of workers registered for MGNREGA work in your district",
    hi: "आपके जिले में मनरेगा काम के लिए पंजीकृत मजदूरों की कुल संख्या",
    simple: "How many people are registered for work",
    icon: "👷"
  },
  Total_Households_Worked: {
    en: "Number of families that got work under MGNREGA",
    hi: "मनरेगा के तहत काम पाने वाले परिवारों की संख्या",
    simple: "Families that got work",
    icon: "🏠"
  },
  Total_Exp: {
    en: "Total money spent on MGNREGA in your district",
    hi: "आपके जिले में मनरेगा पर खर्च की गई कुल राशि",
    simple: "Total money spent",
    icon: "💰"
  },
  Wages: {
    en: "Money paid as wages to workers",
    hi: "मजदूरों को वेतन के रूप में दी गई राशि",
    simple: "Money paid to workers",
    icon: "💵"
  },
  Average_Wage_rate_per_day_per_person: {
    en: "Average daily wage paid per person",
    hi: "प्रति व्यक्ति दी गई औसत दैनिक मजदूरी",
    simple: "Daily wage per person",
    icon: "📊"
  },
  Number_of_Completed_Works: {
    en: "Number of projects completed",
    hi: "पूरी हुई परियोजनाओं की संख्या",
    simple: "Completed projects",
    icon: "✅"
  },
  Number_of_Ongoing_Works: {
    en: "Number of projects currently in progress",
    hi: "वर्तमान में चल रही परियोजनाओं की संख्या",
    simple: "Ongoing projects",
    icon: "🚧"
  },
  Women_Persondays: {
    en: "Total days of work done by women",
    hi: "महिलाओं द्वारा किए गए कार्य के कुल दिन",
    simple: "Work days by women",
    icon: "👩"
  },
  SC_persondays: {
    en: "Total days of work done by SC community members",
    hi: "अनुसूचित जाति के सदस्यों द्वारा किए गए कार्य के कुल दिन",
    simple: "Work days by SC community",
    icon: "👥"
  },
  ST_persondays: {
    en: "Total days of work done by ST community members",
    hi: "अनुसूचित जनजाति के सदस्यों द्वारा किए गए कार्य के कुल दिन",
    simple: "Work days by ST community",
    icon: "👥"
  },
  Average_days_of_employment_provided_per_Household: {
    en: "Average number of days each family got work",
    hi: "प्रत्येक परिवार को काम मिले दिनों की औसत संख्या",
    simple: "Avg work days per family",
    icon: "📅"
  },
  Total_No_of_HHs_completed_100_Days_of_Wage_Employment: {
    en: "Families that got full 100 days of work",
    hi: "पूरे 100 दिन का काम पाने वाले परिवार",
    simple: "Families with 100 days work",
    icon: "🎯"
  },
  Material_and_skilled_Wages: {
    en: "Money spent on materials and skilled workers",
    hi: "सामग्री और कुशल मजदूरों पर खर्च की गई राशि",
    simple: "Material & skilled labor cost",
    icon: "🏗️"
  },
  percentage_payments_gererated_within_15_days: {
    en: "Percentage of payments made within 15 days",
    hi: "15 दिनों के भीतर किए गए भुगतान का प्रतिशत",
    simple: "On-time payments %",
    icon: "⏱️"
  }
};

export const getExplanation = (key, lang = 'en') => {
  const exp = explanations[key];
  if (!exp) return null;
  
  return {
    text: exp[lang] || exp.en,
    simple: exp.simple,
    icon: exp.icon
  };
};

export const formatValue = (key, value) => {
  if (value === null || value === undefined) return 'N/A';
  
  // Format money values
  if (key === 'Total_Exp' || key === 'Wages' || key === 'Material_and_skilled_Wages') {
    return `₹${Number(value).toLocaleString('en-IN')}`;
  }
  
  // Format percentage values
  if (key.includes('percent') || key.includes('percentage')) {
    return `${Number(value).toFixed(2)}%`;
  }
  
  // Format wage rate
  if (key === 'Average_Wage_rate_per_day_per_person') {
    return `₹${Number(value).toFixed(2)}`;
  }
  
  // Format days
  if (key.includes('days') || key.includes('Days')) {
    return `${Number(value).toFixed(1)} days`;
  }
  
  // Default number formatting
  return Number(value).toLocaleString('en-IN');
};

export default explanations;
