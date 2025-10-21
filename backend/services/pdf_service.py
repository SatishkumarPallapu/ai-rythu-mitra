from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.units import inch
from io import BytesIO
from datetime import datetime
from typing import Dict, Any

async def generate_farm_report(data: Dict[str, Any], report_type: str) -> bytes:
    """Generate PDF report for farm data"""
    
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()
    
    # Title
    title = Paragraph(f"<b>AI Rythu Mitra - Farm Report</b>", styles['Title'])
    elements.append(title)
    elements.append(Spacer(1, 0.3*inch))
    
    # Date
    date_text = Paragraph(f"Generated on: {datetime.now().strftime('%B %d, %Y')}", styles['Normal'])
    elements.append(date_text)
    elements.append(Spacer(1, 0.2*inch))
    
    # Farmer Information
    if 'user' in data:
        user = data['user']
        farmer_info = [
            ['Farmer Name:', user.get('name', 'N/A')],
            ['Location:', user.get('farm_location', 'N/A')],
            ['Farm Size:', f"{user.get('farm_size', 'N/A')} acres"],
            ['Contact:', user.get('phone', 'N/A')]
        ]
        
        table = Table(farmer_info, colWidths=[2*inch, 4*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        elements.append(table)
        elements.append(Spacer(1, 0.3*inch))
    
    # Soil Reports Summary
    if 'soil_reports' in data and data['soil_reports']:
        elements.append(Paragraph("<b>Recent Soil Analysis</b>", styles['Heading2']))
        elements.append(Spacer(1, 0.1*inch))
        
        for report in data['soil_reports'][:3]:
            analysis = report.get('analysis', {})
            text = f"Date: {report.get('created_at', 'N/A')[:10]}<br/>"
            text += f"Status: {report.get('status', 'N/A')}<br/>"
            if isinstance(analysis, dict):
                text += f"Analysis: {analysis.get('analysis', 'Pending')}"
            else:
                text += f"Analysis: {str(analysis)[:200]}"
            
            elements.append(Paragraph(text, styles['Normal']))
            elements.append(Spacer(1, 0.1*inch))
    
    # IoT Data Summary
    if 'iot_data' in data and data['iot_data']:
        elements.append(Spacer(1, 0.2*inch))
        elements.append(Paragraph("<b>Latest Sensor Readings</b>", styles['Heading2']))
        elements.append(Spacer(1, 0.1*inch))
        
        iot_table_data = [['Timestamp', 'Moisture %', 'Temperature °C', 'Humidity %']]
        
        for reading in data['iot_data'][:5]:
            iot_table_data.append([
                reading.get('timestamp', 'N/A')[:16],
                f"{reading.get('moisture', 0):.1f}",
                f"{reading.get('temperature', 0):.1f}",
                f"{reading.get('humidity', 0):.1f}"
            ])
        
        iot_table = Table(iot_table_data, colWidths=[2.5*inch, 1.2*inch, 1.5*inch, 1.3*inch])
        iot_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        elements.append(iot_table)
    
    # Crop Recommendations
    if 'crop_recommendations' in data and data['crop_recommendations']:
        elements.append(PageBreak())
        elements.append(Paragraph("<b>AI Crop Recommendations</b>", styles['Heading2']))
        elements.append(Spacer(1, 0.1*inch))
        
        for rec in data['crop_recommendations'][:3]:
            recommendations = rec.get('recommendations', [])
            if recommendations:
                for crop in recommendations[:3]:
                    if isinstance(crop, dict):
                        text = f"<b>{crop.get('name', 'Unknown Crop')}</b><br/>"
                        text += f"Suitability: {crop.get('suitability_score', 0)}/100<br/>"
                        text += f"Expected Yield: {crop.get('expected_yield', 'N/A')}<br/>"
                        text += f"Duration: {crop.get('growth_duration', 'N/A')}"
                        
                        elements.append(Paragraph(text, styles['Normal']))
                        elements.append(Spacer(1, 0.15*inch))
    
    # Footer
    elements.append(Spacer(1, 0.5*inch))
    footer = Paragraph(
        "<i>This report is generated by AI Rythu Mitra for agricultural guidance purposes.</i>",
        styles['Normal']
    )
    elements.append(footer)
    
    # Build PDF
    doc.build(elements)
    
    pdf_content = buffer.getvalue()
    buffer.close()
    
    return pdf_content
