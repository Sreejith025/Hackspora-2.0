import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Format date for PDF display
 */
const formatDate = (dateVal) => {
  if (!dateVal) return 'N/A';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(dateVal);
  }
};

/**
 * Download a single submission PDF containing all required fields:
 * - Team Name
 * - Team ID
 * - Problem Statement Name
 * - GitHub Link
 * - Video Link
 * - PPT/PPTX Link
 * - Submission Status
 * - Evaluator
 * - Submitted Date
 * - Last Updated Date
 */
export const downloadSubmissionPDF = (submission) => {
  if (!submission) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Header Colors & Styling
  const primaryColor = [54, 69, 191]; // #3645bf
  const darkText = [15, 23, 42]; // #0f172a
  const subText = [71, 85, 105]; // #475569
  const accentBg = [248, 250, 252]; // #f8fafc
  const borderColor = [226, 232, 240]; // #e2e8f0

  // 1. Top Decorative Bar
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 6, 'F');

  // 2. Header Title & Banner
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...primaryColor);
  doc.text('HACKSPORA 2.0', margin, 20);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...subText);
  doc.text('VIRTUAL ROUND - PROJECT SUBMISSION REPORT', margin, 26);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  const reportDateStr = `Generated: ${formatDate(new Date())}`;
  doc.text(reportDateStr, pageWidth - margin, 26, { align: 'right' });

  // Line Divider below header
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(0.5);
  doc.line(margin, 30, pageWidth - margin, 30);

  // Extract Submission Data
  const teamName = submission.teamName || 'N/A';
  const teamId = submission.teamId || 'N/A';
  const problemStatementName = submission.problemStatementName || 'N/A';
  const githubLink = submission.githubLink || 'N/A';
  const videoLink = submission.videoLink || 'N/A';
  const pptLink = submission.pptLink || submission.pptFileUrl || 'N/A';
  const status = (submission.status || 'submitted').toUpperCase().replace('_', ' ');
  const evaluator = submission.evaluatorName || 'Not Assigned';
  const submittedDate = formatDate(submission.submittedAt || submission.createdAt);
  const lastUpdatedDate = formatDate(submission.updatedAt || submission.submittedAt);

  // Status badge background color
  let statusBg = [224, 231, 255]; // blue
  let statusText = [49, 46, 129];
  if (status.includes('SHORTLISTED')) {
    statusBg = [220, 252, 231]; // green
    statusText = [20, 83, 45];
  } else if (status.includes('REVIEW')) {
    statusBg = [238, 242, 255]; // indigo
    statusText = [55, 48, 163];
  } else if (status.includes('REJECTED')) {
    statusBg = [254, 226, 226]; // red
    statusText = [127, 29, 29];
  }

  // 3. Team & Overview Box
  let startY = 36;
  doc.setFillColor(...accentBg);
  doc.roundedRect(margin, startY, contentWidth, 38, 3, 3, 'F');
  doc.setDrawColor(...borderColor);
  doc.roundedRect(margin, startY, contentWidth, 38, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...darkText);
  doc.text(teamName, margin + 5, startY + 10);

  doc.setFont('helvetica', 'semibold');
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text(`Team ID: ${teamId}`, margin + 5, startY + 17);

  // Status Pill on top right of overview box
  doc.setFillColor(...statusBg);
  doc.roundedRect(pageWidth - margin - 45, startY + 6, 40, 8, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...statusText);
  doc.text(status, pageWidth - margin - 25, startY + 11.5, { align: 'center' });

  // Additional overview details in box
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...subText);
  doc.text(`Submitted Date: ${submittedDate}`, margin + 5, startY + 26);
  doc.text(`Last Updated: ${lastUpdatedDate}`, margin + 5, startY + 32);

  // 4. Main Details Table using autoTable
  startY = 80;

  const tableData = [
    ['Team Name', teamName],
    ['Team ID', teamId],
    ['Problem Statement Name', problemStatementName],
    ['GitHub Link', githubLink],
    ['Video Link', videoLink],
    ['PPT / PPTX Link', pptLink],
    ['Submission Status', status],
    ['Evaluator', evaluator],
    ['Submitted Date', submittedDate],
    ['Last Updated Date', lastUpdatedDate],
  ];

  autoTable(doc, {
    startY,
    margin: { left: margin, right: margin },
    head: [['Field', 'Submission Details']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: darkText,
      cellPadding: 4,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 55, textColor: subText },
      1: { cellWidth: contentWidth - 55 },
    },
    didParseCell: (data) => {
      // Format links visually or highlight evaluators
      if (data.section === 'body' && data.column.index === 1) {
        const fieldName = tableData[data.row.index][0];
        if (fieldName.includes('Link') && data.cell.text[0] !== 'N/A') {
          data.cell.styles.textColor = primaryColor;
          data.cell.styles.fontStyle = 'bold';
        } else if (fieldName === 'Submission Status') {
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
  });

  // 5. Footer
  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 240;
  const pageHeight = doc.internal.pageSize.getHeight();
  const footerY = Math.max(finalY, pageHeight - 15);

  doc.setDrawColor(...borderColor);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...subText);
  doc.text('Hackspora 2.0 Virtual Round • Confidential & Official Submission Record', margin, footerY);
  doc.text('Page 1 of 1', pageWidth - margin, footerY, { align: 'right' });

  // Save PDF file
  const cleanTeamId = String(teamId).replace(/[^a-zA-Z0-9]/g, '_');
  const cleanTeamName = String(teamName).replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `Submission_${cleanTeamId}_${cleanTeamName}.pdf`;

  doc.save(fileName);
};

/**
 * Download Evaluator-wise combined PDF report containing all submissions
 * assigned to a specific evaluator (or all evaluators).
 */
export const downloadEvaluatorSubmissionsPDF = (evaluatorName, submissions = []) => {
  if (!submissions || submissions.length === 0) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  const primaryColor = [54, 69, 191];
  const darkText = [15, 23, 42];
  const subText = [71, 85, 105];
  const borderColor = [226, 232, 240];

  // Filter submissions by evaluatorName if specified
  const isAll = !evaluatorName || evaluatorName === 'All' || evaluatorName === 'All Evaluators';
  const targetEvaluator = isAll ? 'All Evaluators' : evaluatorName;
  const filteredSubmissions = isAll
    ? submissions
    : submissions.filter(
        (s) => (s.evaluatorName || '').trim().toLowerCase() === evaluatorName.trim().toLowerCase()
      );

  // Top Bar
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 6, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...primaryColor);
  doc.text('HACKSPORA 2.0', margin, 18);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...subText);
  doc.text(`EVALUATOR SUBMISSIONS REPORT - ${targetEvaluator.toUpperCase()}`, margin, 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated: ${formatDate(new Date())} • Submissions: ${filteredSubmissions.length}`, pageWidth - margin, 24, { align: 'right' });

  doc.setDrawColor(...borderColor);
  doc.setLineWidth(0.5);
  doc.line(margin, 28, pageWidth - margin, 28);

  // Summary Table
  const tableRows = filteredSubmissions.map((sub, idx) => [
    idx + 1,
    sub.teamId || 'N/A',
    sub.teamName || 'N/A',
    sub.problemStatementName || 'N/A',
    sub.evaluatorName || 'Not Assigned',
    (sub.status || 'submitted').toUpperCase().replace('_', ' '),
    formatDate(sub.submittedAt || sub.createdAt),
  ]);

  autoTable(doc, {
    startY: 32,
    margin: { left: margin, right: margin },
    head: [['#', 'Team ID', 'Team Name', 'Problem Statement', 'Evaluator', 'Status', 'Submitted Date']],
    body: tableRows,
    theme: 'striped',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: darkText,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 22, fontStyle: 'bold' },
      2: { cellWidth: 35, fontStyle: 'bold' },
      3: { cellWidth: 42 },
      4: { cellWidth: 28 },
      5: { cellWidth: 22, fontStyle: 'bold' },
      6: { cellWidth: 23 },
    },
  });

  // Detailed Submission Cards
  let currentY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 100;

  filteredSubmissions.forEach((sub, i) => {
    // Add new page if space running low
    if (currentY + 65 > pageHeight - 15) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, currentY, contentWidth, 58, 2, 2, 'F');
    doc.setDrawColor(...borderColor);
    doc.roundedRect(margin, currentY, contentWidth, 58, 2, 2, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...primaryColor);
    doc.text(`#${i + 1} ${sub.teamName || 'N/A'} (ID: ${sub.teamId || 'N/A'})`, margin + 4, currentY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...subText);

    doc.text(`Problem Statement: ${sub.problemStatementName || 'N/A'}`, margin + 4, currentY + 14);
    doc.text(`Status: ${(sub.status || 'submitted').toUpperCase().replace('_', ' ')}  |  Evaluator: ${sub.evaluatorName || 'Not Assigned'}`, margin + 4, currentY + 20);
    doc.text(`Submitted Date: ${formatDate(sub.submittedAt || sub.createdAt)}  |  Last Updated Date: ${formatDate(sub.updatedAt || sub.submittedAt)}`, margin + 4, currentY + 26);

    doc.setFont('helvetica', 'bold');
    doc.text(`Submission Links:`, margin + 4, currentY + 33);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(37, 99, 235);
    doc.text(`• GitHub: ${sub.githubLink || 'N/A'}`, margin + 6, currentY + 39);
    doc.text(`• Video: ${sub.videoLink || 'N/A'}`, margin + 6, currentY + 45);
    doc.text(`• PPT/PPTX: ${sub.pptLink || sub.pptFileUrl || 'N/A'}`, margin + 6, currentY + 51);

    currentY += 64;
  });

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...subText);
    doc.text(`Hackspora 2.0 • Evaluator Report (${targetEvaluator})`, margin, pageHeight - 8);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  const cleanEval = String(targetEvaluator).replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Evaluator_Report_${cleanEval}.pdf`);
};
