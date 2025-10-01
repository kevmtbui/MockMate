import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportInterviewToPDF = (interviewData, feedback) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 15;
  let yPosition = 20;

  // Helper function to add text with word wrap
  const addText = (text, y, fontSize = 10, isBold = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
    doc.text(lines, margin, y);
    return y + (lines.length * fontSize * 0.5) + 5;
  };

  // Helper function to check if we need a new page
  const checkNewPage = (requiredSpace) => {
    if (yPosition + requiredSpace > doc.internal.pageSize.height - 20) {
      doc.addPage();
      return 20;
    }
    return yPosition;
  };

  // Title
  doc.setFillColor(6, 182, 212); // Cyan color
  doc.rect(0, 0, pageWidth, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('MockMate Interview Report', pageWidth / 2, 20, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  yPosition = 45;

  // Date
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  yPosition = addText(`Generated: ${currentDate}`, yPosition, 10);
  yPosition += 5;

  // Interview Details Section
  doc.setFillColor(241, 245, 249); // Light gray background
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 35, 'F');
  yPosition += 8;
  
  yPosition = addText('Interview Details', yPosition, 14, true);
  yPosition = addText(`Position: ${interviewData.jobTitle || 'Not specified'}`, yPosition, 10);
  yPosition = addText(`Company: ${interviewData.companyName || 'Not specified'}`, yPosition, 10);
  yPosition = addText(`Experience Level: ${interviewData.jobLevel || 'Not specified'}`, yPosition, 10);
  yPosition = addText(`Interview Type: ${interviewData.interviewType || 'Not specified'}`, yPosition, 10);
  yPosition += 10;

  // Overall Score Section
  yPosition = checkNewPage(60);
  doc.setFillColor(6, 182, 212);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Overall Performance', pageWidth / 2, yPosition + 12, { align: 'center' });
  
  doc.setFontSize(28);
  doc.text(`${feedback.overall.score}/100`, pageWidth / 2, yPosition + 30, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  yPosition += 50;

  // Summary
  yPosition = checkNewPage(40);
  yPosition = addText('Summary', yPosition, 14, true);
  yPosition = addText(feedback.overall.summary, yPosition, 10);
  yPosition += 10;

  // Category Scores
  yPosition = checkNewPage(50);
  yPosition = addText('Category Scores', yPosition, 14, true);
  
  const categoryData = Object.entries(feedback.categories).map(([key, category]) => [
    category.label,
    `${category.score}/100`
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [['Category', 'Score']],
    body: categoryData,
    theme: 'grid',
    headStyles: { fillColor: [6, 182, 212], textColor: 255 },
    margin: { left: margin, right: margin },
    styles: { fontSize: 10 }
  });

  yPosition = doc.lastAutoTable.finalY + 15;

  // Strengths
  yPosition = checkNewPage(40);
  yPosition = addText('Strengths', yPosition, 14, true);
  feedback.overall.strengths.forEach((strength, index) => {
    yPosition = checkNewPage(15);
    yPosition = addText(`✓ ${strength}`, yPosition, 10);
  });
  yPosition += 10;

  // Areas for Improvement
  yPosition = checkNewPage(40);
  yPosition = addText('Areas for Improvement', yPosition, 14, true);
  feedback.overall.improvements.forEach((improvement, index) => {
    yPosition = checkNewPage(15);
    yPosition = addText(`• ${improvement}`, yPosition, 10);
  });
  yPosition += 15;

  // Questions and Answers Section
  doc.addPage();
  yPosition = 20;
  
  doc.setFillColor(6, 182, 212);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Questions & Answers', pageWidth / 2, 15, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  yPosition = 35;

  feedback.questions.forEach((item, index) => {
    // Check if we need a new page for this question
    yPosition = checkNewPage(80);

    // Question number and score
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 15, 'F');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Question ${index + 1}`, margin + 5, yPosition + 10);
    
    // Score badge
    const scoreColor = item.score >= 90 ? [34, 197, 94] : 
                       item.score >= 80 ? [234, 179, 8] :
                       item.score >= 70 ? [249, 115, 22] : [239, 68, 68];
    doc.setFillColor(...scoreColor);
    doc.setTextColor(255, 255, 255);
    const scoreText = `${item.score}/100`;
    const scoreWidth = doc.getTextWidth(scoreText) + 8;
    doc.roundedRect(pageWidth - margin - scoreWidth - 5, yPosition + 3, scoreWidth, 10, 2, 2, 'F');
    doc.setFontSize(10);
    doc.text(scoreText, pageWidth - margin - scoreWidth / 2 - 5, yPosition + 10, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    yPosition += 20;

    // Question text
    yPosition = addText(`Q: ${item.question}`, yPosition, 10, true);
    yPosition += 5;

    // Answer
    yPosition = checkNewPage(30);
    yPosition = addText('Your Answer:', yPosition, 10, true);
    yPosition = addText(item.answer || 'No answer provided', yPosition, 9);
    yPosition += 5;

    // Feedback
    yPosition = checkNewPage(25);
    yPosition = addText('Feedback:', yPosition, 10, true);
    yPosition = addText(item.feedback, yPosition, 9);
    yPosition += 5;

    // Suggestions
    if (item.suggestions && item.suggestions.length > 0) {
      yPosition = checkNewPage(25);
      yPosition = addText('Suggestions:', yPosition, 10, true);
      item.suggestions.forEach(suggestion => {
        yPosition = checkNewPage(15);
        yPosition = addText(`→ ${suggestion}`, yPosition, 9);
      });
    }

    yPosition += 10;
  });

  // Footer on last page
  const totalPages = doc.internal.pages.length - 1; // -1 because pages array includes a null first element
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${totalPages} | MockMate Interview Report | ${currentDate}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  // Generate filename
  const jobTitle = interviewData.jobTitle?.replace(/[^a-z0-9]/gi, '_') || 'Interview';
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `MockMate_${jobTitle}_${dateStr}.pdf`;

  // Save the PDF
  doc.save(filename);
};

