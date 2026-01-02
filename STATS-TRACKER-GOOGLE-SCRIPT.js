// ============================================================================
// FABIEN'S CRITIQUE - STATS TRACKER FOR GOOGLE SHEETS
// ============================================================================
//
// SPREADSHEET ID: 11kNF5huCNgDpPyYNH9i2s5KqaosRN-ika7LQXHyU4ns
//
// TABS:
// - Dashboard: Columns A (Timestamp), B (Email), C (Source)
// - Stats: Automatically updated with daily metrics and source effectiveness
//
// FEATURES:
// ✅ Daily inquiry tracking
// ✅ Source effectiveness analysis
// ✅ Auto-updates on new entries
// ✅ Charts-ready data format
//
// SETUP INSTRUCTIONS:
// 1. Open your Google Sheet
// 2. Go to Extensions → Apps Script
// 3. Delete any existing code
// 4. Paste this entire script
// 5. Save (Ctrl+S or Cmd+S)
// 6. Run "setupTriggers" function once (click Run button)
// 7. Authorize the script when prompted
// 8. Done! Stats will auto-update when new data is added
//
// ============================================================================

const SPREADSHEET_ID = '11kNF5huCNgDpPyYNH9i2s5KqaosRN-ika7LQXHyU4ns';

// Main function that runs when new data is added
function updateStats() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const dashboardSheet = ss.getSheetByName('Dashboard');
    const statsSheet = ss.getSheetByName('Stats');

    // Get all data from Dashboard (skip header row)
    const data = dashboardSheet.getDataRange().getValues();
    const headers = data[0]; // First row is headers
    const rows = data.slice(1); // All rows except header

    // Filter out empty rows
    const validRows = rows.filter(row => row[0] && row[1]); // Must have timestamp and email

    if (validRows.length === 0) {
      Logger.log('No data to process');
      return;
    }

    // Calculate statistics
    const dailyStats = calculateDailyStats(validRows);
    const sourceStats = calculateSourceStats(validRows);
    const overallStats = calculateOverallStats(validRows);

    // Update Stats sheet
    updateStatsSheet(statsSheet, dailyStats, sourceStats, overallStats);

    Logger.log('Stats updated successfully!');

  } catch (error) {
    Logger.log('Error updating stats: ' + error.toString());
  }
}

// Calculate daily inquiry counts
function calculateDailyStats(rows) {
  const dailyCounts = {};

  rows.forEach(row => {
    const timestamp = row[0];
    const date = new Date(timestamp);
    const dateKey = Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');

    if (!dailyCounts[dateKey]) {
      dailyCounts[dateKey] = 0;
    }
    dailyCounts[dateKey]++;
  });

  // Convert to array and sort by date
  const dailyArray = Object.keys(dailyCounts).map(date => ({
    date: date,
    count: dailyCounts[date]
  }));

  dailyArray.sort((a, b) => a.date.localeCompare(b.date));

  return dailyArray;
}

// Calculate source effectiveness
function calculateSourceStats(rows) {
  const sourceCounts = {};

  rows.forEach(row => {
    const source = row[2] || 'Unknown';

    if (!sourceCounts[source]) {
      sourceCounts[source] = 0;
    }
    sourceCounts[source]++;
  });

  // Convert to array and sort by count (descending)
  const sourceArray = Object.keys(sourceCounts).map(source => ({
    source: source,
    count: sourceCounts[source]
  }));

  sourceArray.sort((a, b) => b.count - a.count);

  return sourceArray;
}

// Calculate overall statistics
function calculateOverallStats(rows) {
  const total = rows.length;
  const uniqueEmails = new Set(rows.map(row => row[1])).size;

  // Get date range
  const dates = rows.map(row => new Date(row[0]));
  const firstDate = new Date(Math.min(...dates));
  const lastDate = new Date(Math.max(...dates));

  // Calculate today's count
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const todayCount = rows.filter(row => {
    const rowDate = Utilities.formatDate(new Date(row[0]), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    return rowDate === today;
  }).length;

  // Calculate this week's count
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekCount = rows.filter(row => new Date(row[0]) >= weekAgo).length;

  // Calculate this month's count
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthCount = rows.filter(row => new Date(row[0]) >= monthStart).length;

  return {
    total: total,
    uniqueEmails: uniqueEmails,
    todayCount: todayCount,
    weekCount: weekCount,
    monthCount: monthCount,
    firstDate: firstDate,
    lastDate: lastDate
  };
}

// Update the Stats sheet with all data
function updateStatsSheet(sheet, dailyStats, sourceStats, overallStats) {
  // Clear existing content and charts
  sheet.clear();
  const charts = sheet.getCharts();
  charts.forEach(chart => sheet.removeChart(chart));

  let currentRow = 1;
  const chartColumn = 8; // Column H - where charts start

  // ========================================
  // SECTION 1: OVERALL STATISTICS
  // ========================================
  sheet.getRange(currentRow, 1).setValue('📊 OVERALL STATISTICS').setFontWeight('bold').setFontSize(14);
  sheet.getRange(currentRow, 1, 1, 2).setBackground('#d97706').setFontColor('#ffffff').setHorizontalAlignment('center');
  currentRow += 2;

  const overallData = [
    ['Total Sign-ups:', overallStats.total],
    ['Unique Emails:', overallStats.uniqueEmails],
    ['Today:', overallStats.todayCount],
    ['Last 7 Days:', overallStats.weekCount],
    ['This Month:', overallStats.monthCount],
    ['First Sign-up:', Utilities.formatDate(overallStats.firstDate, Session.getScriptTimeZone(), 'MM/dd/yyyy HH:mm')],
    ['Latest Sign-up:', Utilities.formatDate(overallStats.lastDate, Session.getScriptTimeZone(), 'MM/dd/yyyy HH:mm')]
  ];

  sheet.getRange(currentRow, 1, overallData.length, 2).setValues(overallData);
  sheet.getRange(currentRow, 1, overallData.length, 1).setFontWeight('bold');
  sheet.getRange(currentRow, 2, overallData.length, 1).setHorizontalAlignment('center');
  const overallStatsEndRow = currentRow + overallData.length;
  currentRow += overallData.length + 2;

  // ========================================
  // SECTION 2: SOURCE EFFECTIVENESS
  // ========================================
  const sourceStartRow = currentRow;
  sheet.getRange(currentRow, 1).setValue('🎯 SOURCE EFFECTIVENESS').setFontWeight('bold').setFontSize(14);
  sheet.getRange(currentRow, 1, 1, 3).setBackground('#d97706').setFontColor('#ffffff').setHorizontalAlignment('center');
  currentRow++;

  // Headers
  sheet.getRange(currentRow, 1, 1, 3).setValues([['Source', 'Count', 'Percentage']]);
  sheet.getRange(currentRow, 1, 1, 3).setFontWeight('bold').setBackground('#f3f3f3').setHorizontalAlignment('center');
  const sourceDataStartRow = currentRow + 1;
  currentRow++;

  // Source data with percentages
  const sourceData = sourceStats.map(item => {
    const percentage = ((item.count / overallStats.total) * 100).toFixed(1) + '%';
    return [item.source, item.count, percentage];
  });

  if (sourceData.length > 0) {
    sheet.getRange(currentRow, 1, sourceData.length, 3).setValues(sourceData);
    sheet.getRange(currentRow, 1, sourceData.length, 1).setHorizontalAlignment('left');
    sheet.getRange(currentRow, 2, sourceData.length, 2).setHorizontalAlignment('center');
    const sourceDataEndRow = currentRow + sourceData.length - 1;

    // CREATE CHART 1: Source Effectiveness Pie Chart
    createSourcePieChart(sheet, sourceDataStartRow, sourceDataEndRow, chartColumn, sourceStartRow);

    currentRow += sourceData.length + 2;
  }

  // ========================================
  // SECTION 3: DAILY BREAKDOWN
  // ========================================
  const dailyStartRow = currentRow;
  sheet.getRange(currentRow, 1).setValue('📅 DAILY BREAKDOWN').setFontWeight('bold').setFontSize(14);
  sheet.getRange(currentRow, 1, 1, 2).setBackground('#d97706').setFontColor('#ffffff').setHorizontalAlignment('center');
  currentRow++;

  // Headers
  sheet.getRange(currentRow, 1, 1, 2).setValues([['Date', 'Sign-ups']]);
  sheet.getRange(currentRow, 1, 1, 2).setFontWeight('bold').setBackground('#f3f3f3').setHorizontalAlignment('center');
  const dailyDataStartRow = currentRow + 1;
  currentRow++;

  // Daily data
  const dailyData = dailyStats.map(item => [item.date, item.count]);

  if (dailyData.length > 0) {
    sheet.getRange(currentRow, 1, dailyData.length, 2).setValues(dailyData);
    sheet.getRange(currentRow, 1, dailyData.length, 1).setHorizontalAlignment('center');
    sheet.getRange(currentRow, 2, dailyData.length, 1).setHorizontalAlignment('center');
    const dailyDataEndRow = currentRow + dailyData.length - 1;

    // CREATE CHART 2: Daily Trend Line Chart
    createDailyTrendChart(sheet, dailyDataStartRow, dailyDataEndRow, chartColumn, dailyStartRow + 16);

    currentRow += dailyData.length + 2;
  }

  // ========================================
  // SECTION 4: BEST PERFORMING DAYS OF THE WEEK
  // ========================================
  const dayOfWeekStartRow = currentRow;
  sheet.getRange(currentRow, 1).setValue('📅 BEST PERFORMING DAYS OF THE WEEK').setFontWeight('bold').setFontSize(14);
  sheet.getRange(currentRow, 1, 1, 3).setBackground('#d97706').setFontColor('#ffffff').setHorizontalAlignment('center');
  currentRow++;

  const dayOfWeekStats = calculateDayOfWeekStats(SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Dashboard').getDataRange().getValues().slice(1));

  // Headers
  sheet.getRange(currentRow, 1, 1, 3).setValues([['Day of Week', 'Sign-ups', 'Average per Day']]);
  sheet.getRange(currentRow, 1, 1, 3).setFontWeight('bold').setBackground('#f3f3f3').setHorizontalAlignment('center');
  const dayOfWeekDataStartRow = currentRow + 1;
  currentRow++;

  // Day of week data
  if (dayOfWeekStats.length > 0) {
    const dayOfWeekData = dayOfWeekStats.map(item => [item.day, item.count, item.average]);
    sheet.getRange(currentRow, 1, dayOfWeekData.length, 3).setValues(dayOfWeekData);
    sheet.getRange(currentRow, 1, dayOfWeekData.length, 1).setHorizontalAlignment('left');
    sheet.getRange(currentRow, 2, dayOfWeekData.length, 2).setHorizontalAlignment('center');
    const dayOfWeekDataEndRow = currentRow + dayOfWeekData.length - 1;

    // CREATE CHART 3: Day of Week Performance Bar Chart
    createDayOfWeekChart(sheet, dayOfWeekDataStartRow, dayOfWeekDataEndRow, chartColumn, dailyStartRow + 32);

    currentRow += dayOfWeekData.length + 2;
  }

  // ========================================
  // SECTION 5: TOP SOURCES LAST 7 DAYS
  // ========================================
  const topSourcesStartRow = currentRow;
  sheet.getRange(currentRow, 1).setValue('🔥 TOP SOURCES (LAST 7 DAYS)').setFontWeight('bold').setFontSize(14);
  sheet.getRange(currentRow, 1, 1, 2).setBackground('#d97706').setFontColor('#ffffff').setHorizontalAlignment('center');
  currentRow++;

  const topSourcesLast7Days = calculateTopSourcesLastDays(SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Dashboard').getDataRange().getValues().slice(1), 7);

  // Headers
  sheet.getRange(currentRow, 1, 1, 2).setValues([['Source', 'Sign-ups (Last 7 Days)']]);
  sheet.getRange(currentRow, 1, 1, 2).setFontWeight('bold').setBackground('#f3f3f3').setHorizontalAlignment('center');
  currentRow++;

  // Top sources data
  if (topSourcesLast7Days.length > 0) {
    const topSourcesData = topSourcesLast7Days.map(item => [item.source, item.count]);
    sheet.getRange(currentRow, 1, topSourcesData.length, 2).setValues(topSourcesData);
    sheet.getRange(currentRow, 1, topSourcesData.length, 1).setHorizontalAlignment('left');
    sheet.getRange(currentRow, 2, topSourcesData.length, 1).setHorizontalAlignment('center');
  }

  // Auto-resize columns
  sheet.autoResizeColumns(1, 10);

  // Add last updated timestamp
  const lastUpdatedRow = 1;
  sheet.getRange(lastUpdatedRow, 4).setValue('Last Updated:');
  sheet.getRange(lastUpdatedRow, 5).setValue(new Date());
  sheet.getRange(lastUpdatedRow, 4).setFontWeight('bold');
  sheet.getRange(lastUpdatedRow, 5).setNumberFormat('MM/dd/yyyy HH:mm:ss');
  sheet.getRange(lastUpdatedRow, 4, 1, 2).setHorizontalAlignment('right');
}

// ============================================================================
// CHART CREATION FUNCTIONS
// ============================================================================

// Chart 1: Source Effectiveness Pie Chart
function createSourcePieChart(sheet, dataStartRow, dataEndRow, chartColumn, chartRow) {
  const range = sheet.getRange(dataStartRow, 1, dataEndRow - dataStartRow + 1, 2);

  const chart = sheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(range)
    .setPosition(chartRow, chartColumn, 0, 0)
    .setOption('title', '🎯 Source Effectiveness')
    .setOption('titleTextStyle', {
      fontSize: 14,
      bold: true,
      color: '#1a1a1a'
    })
    .setOption('width', 450)
    .setOption('height', 300)
    .setOption('pieHole', 0.4)
    .setOption('colors', ['#d97706', '#0C5EC7', '#8B0000', '#CC3700', '#8B2855', '#4A1B6F'])
    .setOption('legend', {
      position: 'right',
      textStyle: {
        fontSize: 11
      }
    })
    .setOption('pieSliceText', 'percentage')
    .setOption('pieSliceTextStyle', {
      color: '#ffffff',
      fontSize: 12,
      bold: true
    })
    .setOption('chartArea', {
      width: '85%',
      height: '75%'
    })
    .setOption('backgroundColor', '#ffffff')
    .build();

  sheet.insertChart(chart);
}

// Chart 2: Daily Trend Line Chart
function createDailyTrendChart(sheet, dataStartRow, dataEndRow, chartColumn, chartRow) {
  const range = sheet.getRange(dataStartRow, 1, dataEndRow - dataStartRow + 1, 2);

  const chart = sheet.newChart()
    .setChartType(Charts.ChartType.LINE)
    .addRange(range)
    .setPosition(chartRow, chartColumn, 0, 0)
    .setOption('title', '📈 Daily Sign-ups Trend')
    .setOption('titleTextStyle', {
      fontSize: 14,
      bold: true,
      color: '#1a1a1a'
    })
    .setOption('width', 450)
    .setOption('height', 300)
    .setOption('curveType', 'function')
    .setOption('lineWidth', 3)
    .setOption('pointSize', 5)
    .setOption('colors', ['#d97706'])
    .setOption('legend', { position: 'none' })
    .setOption('hAxis', {
      title: 'Date',
      titleTextStyle: {
        fontSize: 11,
        italic: false,
        bold: true
      },
      slantedText: true,
      slantedTextAngle: 45,
      textStyle: {
        fontSize: 9
      }
    })
    .setOption('vAxis', {
      title: 'Sign-ups',
      titleTextStyle: {
        fontSize: 11,
        italic: false,
        bold: true
      },
      minValue: 0,
      format: '0'
    })
    .setOption('chartArea', {
      width: '75%',
      height: '65%'
    })
    .setOption('backgroundColor', '#ffffff')
    .build();

  sheet.insertChart(chart);
}

// Chart 3: Day of Week Performance Bar Chart
function createDayOfWeekChart(sheet, dataStartRow, dataEndRow, chartColumn, chartRow) {
  const range = sheet.getRange(dataStartRow, 1, dataEndRow - dataStartRow + 1, 2);

  const chart = sheet.newChart()
    .setChartType(Charts.ChartType.BAR)
    .addRange(range)
    .setPosition(chartRow, chartColumn, 0, 0)
    .setOption('title', '📅 Best Days to Post')
    .setOption('titleTextStyle', {
      fontSize: 14,
      bold: true,
      color: '#1a1a1a'
    })
    .setOption('width', 450)
    .setOption('height', 350)
    .setOption('colors', ['#d97706'])
    .setOption('legend', { position: 'none' })
    .setOption('hAxis', {
      title: 'Total Sign-ups',
      titleTextStyle: {
        fontSize: 11,
        italic: false,
        bold: true
      },
      minValue: 0,
      format: '0',
      textStyle: {
        fontSize: 10
      }
    })
    .setOption('vAxis', {
      title: 'Day of Week',
      titleTextStyle: {
        fontSize: 11,
        italic: false,
        bold: true
      },
      textStyle: {
        fontSize: 11,
        bold: true
      }
    })
    .setOption('chartArea', {
      width: '70%',
      height: '75%'
    })
    .setOption('backgroundColor', '#ffffff')
    .setOption('bar', { groupWidth: '75%' })
    .build();

  sheet.insertChart(chart);
}

// Calculate day of week statistics
function calculateDayOfWeekStats(rows) {
  const validRows = rows.filter(row => row[0] && row[1]);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayCounts = {
    'Sunday': 0,
    'Monday': 0,
    'Tuesday': 0,
    'Wednesday': 0,
    'Thursday': 0,
    'Friday': 0,
    'Saturday': 0
  };
  const dayOccurrences = {
    'Sunday': new Set(),
    'Monday': new Set(),
    'Tuesday': new Set(),
    'Wednesday': new Set(),
    'Thursday': new Set(),
    'Friday': new Set(),
    'Saturday': new Set()
  };

  validRows.forEach(row => {
    const date = new Date(row[0]);
    const dayName = dayNames[date.getDay()];
    const dateKey = Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');

    dayCounts[dayName]++;
    dayOccurrences[dayName].add(dateKey);
  });

  // Calculate average per unique day
  const dayStats = dayNames.map(day => {
    const uniqueDays = dayOccurrences[day].size;
    const average = uniqueDays > 0 ? (dayCounts[day] / uniqueDays).toFixed(1) : 0;
    return {
      day: day,
      count: dayCounts[day],
      average: parseFloat(average)
    };
  });

  // Sort by count descending
  dayStats.sort((a, b) => b.count - a.count);

  return dayStats;
}

// Calculate top sources for last N days
function calculateTopSourcesLastDays(rows, days) {
  const validRows = rows.filter(row => row[0] && row[1]);

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const sourceCounts = {};

  validRows.forEach(row => {
    const date = new Date(row[0]);
    if (date >= cutoffDate) {
      const source = row[2] || 'Unknown';
      if (!sourceCounts[source]) {
        sourceCounts[source] = 0;
      }
      sourceCounts[source]++;
    }
  });

  // Convert to array and sort by count (descending)
  const sourceArray = Object.keys(sourceCounts).map(source => ({
    source: source,
    count: sourceCounts[source]
  }));

  sourceArray.sort((a, b) => b.count - a.count);

  return sourceArray;
}

// ============================================================================
// TRIGGER SETUP
// ============================================================================

// Run this function ONCE to set up automatic triggers
function setupTriggers() {
  // Remove existing triggers to avoid duplicates
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));

  // Create trigger that runs when spreadsheet is edited
  ScriptApp.newTrigger('onSpreadsheetEdit')
    .forSpreadsheet(SPREADSHEET_ID)
    .onEdit()
    .create();

  // Create trigger that runs when form is submitted (if using Google Form)
  ScriptApp.newTrigger('updateStats')
    .forSpreadsheet(SPREADSHEET_ID)
    .onFormSubmit()
    .create();

  Logger.log('✅ Triggers set up successfully!');
  Logger.log('Stats will now auto-update when:');
  Logger.log('- Dashboard is edited manually');
  Logger.log('- Form submissions are received');

  // Run initial stats update
  updateStats();
}

// This function runs automatically when the spreadsheet is edited
function onSpreadsheetEdit(e) {
  try {
    const sheet = e.source.getActiveSheet();
    const sheetName = sheet.getName();

    // Only update stats if Dashboard was edited
    if (sheetName === 'Dashboard') {
      updateStats();
      Logger.log('Stats updated after Dashboard edit');
    }
  } catch (error) {
    Logger.log('Error in onSpreadsheetEdit: ' + error.toString());
  }
}

// Manual trigger - run this to update stats manually
function manualUpdate() {
  updateStats();
  SpreadsheetApp.getUi().alert('✅ Stats updated successfully!');
}

// ============================================================================
// TESTING & UTILITIES
// ============================================================================

// Test function - add sample data to test the stats
function addSampleData() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Dashboard');

  const sampleData = [
    [new Date('2025-01-08 10:00:00'), 'test1@example.com', 'YouTube'],
    [new Date('2025-01-08 11:30:00'), 'test2@example.com', 'Facebook'],
    [new Date('2025-01-08 14:00:00'), 'test3@example.com', 'YouTube'],
    [new Date('2025-01-09 09:00:00'), 'test4@example.com', 'Instagram'],
    [new Date('2025-01-09 15:30:00'), 'test5@example.com', 'Reddit'],
    [new Date('2025-01-10 10:00:00'), 'test6@example.com', 'YouTube'],
    [new Date('2025-01-10 11:00:00'), 'test7@example.com', 'Facebook'],
    [new Date('2025-01-10 16:00:00'), 'test8@example.com', 'YouTube']
  ];

  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow + 1, 1, sampleData.length, 3).setValues(sampleData);

  updateStats();

  Logger.log('✅ Sample data added and stats updated!');
}

// Clean up - remove all triggers (use if needed)
function removeTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  Logger.log('✅ All triggers removed');
}
