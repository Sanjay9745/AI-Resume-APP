import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator, SafeAreaView, Platform, Dimensions, Alert, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import cdnUrl from '../../api/cdnUrl';
import { getTemplateContent, getTemplateStyles } from './ResumeTemplates';
import { getSampleResumeHtml } from './SampleResumeHtml';
import { generateResumePDF } from '@/api/chat';

// Sample HTML with A4 page styling and page break functionality
const createHtmlWithPageControls = (content) => `
<!DOCTYPE html>
<html>
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
	<style>
		* {
			box-sizing: border-box;
			-webkit-print-color-adjust: exact !important;
			print-color-adjust: exact !important;
		}
		
		html, body {
			margin: 0;
			padding: 0;
			background-color: #f0f0f0;
			font-family: Arial, sans-serif;
			height: 100%;
			font-size: 14px;
		}

		@media screen and (max-width: 600px) {
			body {
				font-size: 12px;
			}
		}
		
		#page-container {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 20px 0;
			min-height: 100%;
		}
		
		.page {
			background-color: white;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
			position: relative;
			page-break-after: always;
			overflow: hidden;
		}
		
		/* A4 size */
		@media screen {
			.page {
				width: 90%;
				max-width: 21cm;
				min-height: 29.7cm;
				padding: 2cm;
				margin-bottom: 20px;
			}
		}
		
		/* Mobile responsiveness */
		@media screen and (max-width: 600px) {
			.page {
				width: 95%;
				padding: 1cm;
			}
		}
		
		@media print {
			.page {
				width: 21cm;
				height: 29.7cm;
				margin: 0;
				padding: 2cm;
				box-shadow: none;
				page-break-after: always;
			}
			.page-break-controls, #page-controls, #toolbar {
				display: none !important;
			}
			body {
				background-color: white;
			}
			#page-container {
				padding: 0;
			}
		}
		
		.page-break {
			height: 3px;
			background-color: #3b82f6;
			margin: 0 0 20px 0;
			position: relative;
			cursor: move;
			width: 90%;
			max-width: 21cm;
		}
		
		.page-break::before {
			content: "Page Break";
			position: absolute;
			top: -20px;
			left: 0;
			background-color: #3b82f6;
			color: white;
			padding: 2px 8px;
			border-radius: 4px;
			font-size: 12px;
			z-index: 10;
		}
		
		.page-break-controls {
			position: absolute;
			right: 0;
			top: -20px;
			z-index: 10;
		}
		
		.control-button {
			background-color: #3b82f6;
			color: white;
			border: none;
			border-radius: 4px;
			padding: 2px 8px;
			margin-left: 5px;
			cursor: pointer;
			font-size: 12px;
		}
		
		#toolbar {
			position: fixed;
			bottom: 20px;
			right: 20px;
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			z-index: 1000;
		}
		
		.toolbar-button {
			width: 50px;
			height: 50px;
			border-radius: 50%;
			background-color: #3b82f6;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 10px;
			box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
			cursor: pointer;
			transition: transform 0.2s;
		}
		
		.toolbar-button:hover {
			transform: scale(1.1);
		}
		
		.toolbar-button svg {
			width: 24px;
			height: 24px;
		}
		
		.page-content {
			position: relative;
			height: 100%;
			z-index: 1;
		}
		
		/* Selection styling */
		::selection {
			background: rgba(59, 130, 246, 0.3);
		}
		
		.resume-content h1, .resume-content h2 {
			color: #3b82f6;
			margin-top: 0;
		}
		
		.resume-content h1 {
			text-align: center;
			margin-bottom: 10px;
		}
		
		.resume-content h2 {
			border-bottom: 2px solid #3b82f6;
			padding-bottom: 5px;
			margin-top: 20px;
		}
		
		.resume-content .header {
			text-align: center;
			margin-bottom: 20px;
		}
		
		.resume-content .contact-info {
			display: flex;
			justify-content: center;
			flex-wrap: wrap;
			gap: 15px;
			margin-bottom: 20px;
		}
		
		.resume-content .section {
			margin-bottom: 20px;
		}
		
		.resume-content .experience-item, .resume-content .education-item {
			margin-bottom: 15px;
		}
		
		.resume-content .job-title, .resume-content .degree {
			font-weight: bold;
			margin-bottom: 5px;
		}
		
		.resume-content .company-date, .resume-content .school-date {
			display: flex;
			justify-content: space-between;
			margin-bottom: 5px;
			font-style: italic;
			color: #555;
		}
		
		.resume-content .skills {
			display: flex;
			flex-wrap: wrap;
			gap: 10px;
		}
		
		.resume-content .skill {
			background-color: #f0f9ff;
			border: 1px solid #dbeafe;
			border-radius: 15px;
			padding: 5px 10px;
			color: #3b82f6;
		}
	</style>
</head>
<body>
	<div id="page-container">
		${content ? `
			<div class="page">
				<div class="page-content">
					<div class="resume-content">
						${content}
					</div>
				</div>
			</div>` : getSampleResumeHtml() }
	</div>
	
	<div id="toolbar">
		<div class="toolbar-button" onclick="addPageBreak()" title="Add Page Break">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
				<line x1="12" y1="5" x2="12" y2="19"></line>
				<line x1="5" y1="12" x2="19" y2="12"></line>
			</svg>
		</div>
		<div class="toolbar-button" onclick="printDocument()" title="Save as PDF">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
				<polyline points="6 9 6 2 18 2 18 9"></polyline>
				<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
				<rect x="6" y="14" width="12" height="8"></rect>
			</svg>
		</div>
	</div>
	
	<script>
		// Track currently selected content for potential page break
		let selectedContent = null;
		let selectedRange = null;
		
		document.addEventListener('selectionchange', function() {
			const selection = window.getSelection();
			if (selection.rangeCount > 0 && !selection.isCollapsed) {
				selectedRange = selection.getRangeAt(0);
				selectedContent = selectedRange.cloneContents();
			} else {
				selectedRange = null;
				selectedContent = null;
			}
		});
		
		function addPageBreak() {
			const container = document.getElementById('page-container');
			
			// If there's a text selection, split the content at that point
			if (selectedRange && selectedContent) {
				// Find the page that contains the selection
				const pages = document.querySelectorAll('.page');
				let targetPage = null;
				
				for (let page of pages) {
					if (page.contains(selectedRange.commonAncestorContainer)) {
						targetPage = page;
						break;
					}
				}
				
				if (targetPage) {
					// Create a new page
					const newPage = document.createElement('div');
					newPage.className = 'page';
					
					// Create page content container
					const newPageContent = document.createElement('div');
					newPageContent.className = 'page-content';
					
					// Create resume content container
					const newResumeContent = document.createElement('div');
					newResumeContent.className = 'resume-content';
					
					newPageContent.appendChild(newResumeContent);
					newPage.appendChild(newPageContent);
					
					// Extract the content after the selection
					selectedRange.deleteContents();
					
					// Find the closest section ancestor to the selection
					let sectionAncestor = selectedRange.commonAncestorContainer;
					while (sectionAncestor && 
								(!sectionAncestor.classList || !sectionAncestor.classList.contains('section'))) {
						if (sectionAncestor.nodeType === Node.TEXT_NODE) {
							sectionAncestor = sectionAncestor.parentNode;
						} else {
							sectionAncestor = sectionAncestor.parentNode;
						}
					}
					
					// If we found a section, move all following sections to the new page
					if (sectionAncestor) {
						let currentNode = sectionAncestor.nextElementSibling;
						
						while (currentNode) {
							const nextNode = currentNode.nextElementSibling;
							newResumeContent.appendChild(currentNode);
							currentNode = nextNode;
						}
					}
					
					// Create a page break
					const pageBreak = document.createElement('div');
					pageBreak.className = 'page-break';
					
					// Create controls for the page break
					const controls = document.createElement('div');
					controls.className = 'page-break-controls';
					
					const deleteBtn = document.createElement('button');
					deleteBtn.className = 'control-button';
					deleteBtn.textContent = 'Delete';
					deleteBtn.onclick = function(e) {
						e.stopPropagation();
						mergePagesAtBreak(pageBreak);
					};
					
					controls.appendChild(deleteBtn);
					pageBreak.appendChild(controls);
					
					// Add the page break and new page after the current page
					targetPage.after(pageBreak);
					pageBreak.after(newPage);
					
					// Clear the selection
					window.getSelection().removeAllRanges();
					
					// Make page break draggable
					pageBreak.draggable = true;
					pageBreak.addEventListener('dragstart', handleDragStart);
				}
			} else {
				// If no selection, just add a page break after the last page
				const lastPage = container.querySelector('.page:last-of-type');
				
				// Create a new empty page
				const newPage = document.createElement('div');
				newPage.className = 'page';
				
				const newPageContent = document.createElement('div');
				newPageContent.className = 'page-content';
				
				const newResumeContent = document.createElement('div');
				newResumeContent.className = 'resume-content';
				newResumeContent.innerHTML = '<div class="section"><h2>New Section</h2><p>Click to add content...</p></div>';
				
				newPageContent.appendChild(newResumeContent);
				newPage.appendChild(newPageContent);
				
				// Create a page break
				const pageBreak = document.createElement('div');
				pageBreak.className = 'page-break';
				pageBreak.draggable = true;
				
				// Create controls for the page break
				const controls = document.createElement('div');
				controls.className = 'page-break-controls';
				
				const deleteBtn = document.createElement('button');
				deleteBtn.className = 'control-button';
				deleteBtn.textContent = 'Delete';
				deleteBtn.onclick = function(e) {
					e.stopPropagation();
					mergePagesAtBreak(pageBreak);
				};
				
				controls.appendChild(deleteBtn);
				pageBreak.appendChild(controls);
				
				// Add the page break and new page after the last page
				lastPage.after(pageBreak);
				pageBreak.after(newPage);
				
				// Make page break draggable
				pageBreak.addEventListener('dragstart', handleDragStart);
			}
			
			// Notify React Native that we added a page break
			window.ReactNativeWebView?.postMessage('pageBreakAdded');
		}
		
		function mergePagesAtBreak(pageBreak) {
			// Find previous and next pages
			const prevPage = pageBreak.previousElementSibling;
			const nextPage = pageBreak.nextElementSibling;
			
			if (prevPage && nextPage && prevPage.classList.contains('page') && nextPage.classList.contains('page')) {
				// Get the content containers
				const prevContent = prevPage.querySelector('.resume-content');
				const nextContent = nextPage.querySelector('.resume-content');
				
				// Move all content from next page to previous page
				while (nextContent.firstChild) {
					prevContent.appendChild(nextContent.firstChild);
				}
				
				// Remove the page break and empty page
				pageBreak.remove();
				nextPage.remove();
				
				// Notify React Native
				window.ReactNativeWebView?.postMessage('pagesMerged');
			}
		}
		
		function handleDragStart(e) {
			e.dataTransfer.setData('text/plain', '');
			e.dataTransfer.effectAllowed = 'move';
			window.draggedBreak = e.target;
		}
		
		// Add drag and drop support for the container
		const container = document.getElementById('page-container');
		
		container.addEventListener('dragover', function(e) {
			e.preventDefault();
			e.dataTransfer.dropEffect = 'move';
			
			const y = e.clientY;
			const pages = document.querySelectorAll('.page');
			
			pages.forEach(page => {
				const rect = page.getBoundingClientRect();
				if (y > rect.top && y < rect.bottom) {
					page.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.5)';
				} else {
					page.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
				}
			});
		});
		
		container.addEventListener('drop', function(e) {
			e.preventDefault();
			
			if (window.draggedBreak) {
				const y = e.clientY;
				const pages = document.querySelectorAll('.page');
				let targetPage = null;
				
				pages.forEach(page => {
					const rect = page.getBoundingClientRect();
					if (y > rect.top && y < rect.bottom) {
						targetPage = page;
					}
					page.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
				});
				
				if (targetPage) {
					// Get the next page after the break
					const nextPageAfterBreak = window.draggedBreak.nextElementSibling;
					
					// Move the break after the target page
					targetPage.after(window.draggedBreak);
					
					// Move the next page after the break
					if (nextPageAfterBreak && nextPageAfterBreak.classList.contains('page')) {
						window.draggedBreak.after(nextPageAfterBreak);
					}
					
					// Notify React Native
					window.ReactNativeWebView?.postMessage('breakMoved');
				}
				
				window.draggedBreak = null;
			}
		});
		
		function printDocument() {
			window.print();
		}
		
		// Make content editable
		document.querySelectorAll('.resume-content').forEach(content => {
			content.setAttribute('contenteditable', 'true');
		});
		
		// Notify React Native when loaded
		window.addEventListener('load', function() {
			window.ReactNativeWebView?.postMessage('loaded');
		});
	</script>
</body>
</html>
`;

const PreviewModal = ({ visible, onClose, resumePath, htmlContent, sessionId, jsonData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resumeHtml, setResumeHtml] = useState('');
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const webViewRef = useRef(null);
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    if (visible) {
      if (htmlContent) {
        setResumeHtml(createHtmlWithPageControls(htmlContent));
        setIsLoading(false);
      } else if (resumePath) {
        fetchResumeHtml();
      } else {
        setResumeHtml(createHtmlWithPageControls());
        setIsLoading(false);
      }
    }
  }, [visible, resumePath, htmlContent]);

  const fetchResumeHtml = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${cdnUrl}${resumePath}`);
      if (!response.ok) {
        throw new Error('Failed to fetch resume content');
      }
      const html = await response.text();
      let bodyContent = html;
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      if (bodyMatch && bodyMatch[1]) {
        bodyContent = bodyMatch[1];
      }

      setResumeHtml(createHtmlWithPageControls(bodyContent));
      setError(null);
    } catch (err) {
      console.error('Error fetching resume:', err);
      setError('Failed to load the resume preview');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = async () => {
    try {
      setIsPdfGenerating(true);
      // Get the current HTML content from WebView
      webViewRef.current.injectJavaScript(`
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'getHtmlContent',
          content: document.documentElement.outerHTML
        }));
        true;
      `);
    } catch (error) {
      console.error('Error starting PDF generation:', error);
      Alert.alert('Error', 'Failed to start PDF generation');
      setIsPdfGenerating(false);
    }
  };

  const onMessage = async (event) => {
    try {
      const message = event.nativeEvent.data;
      
      // Handle plain text messages first
      if (typeof message === 'string' && (
          message === 'loaded' || 
          message === 'pageBreakAdded' || 
          message === 'pagesMerged' || 
          message === 'breakMoved')) {
        console.log('Received WebView event:', message);
        return; // Just log these events for now
      }
      
      // Try to parse as JSON for structured messages
      try {
        const data = JSON.parse(message);
        
        switch (data.type) {
          case 'getHtmlContent':
            setIsPdfGenerating(true);
            try {
              const response = await generateResumePDF(sessionId, jsonData);
              if (response.success && response.result) {
                // Open the PDF
                await Linking.openURL(`${cdnUrl}${response.result}`);
              } else {
                throw new Error('Failed to generate PDF');
              }
            } catch (pdfError) {
              console.error('PDF generation error:', pdfError);
              Alert.alert('Error', 'Failed to generate PDF. Please try again.');
            }
            break;
            
          case 'contentMoved':
            if (data.content) {
              AsyncStorage.setItem('lastResumeState', JSON.stringify(data))
                .catch(err => console.error('Error saving resume state:', err));
            }
            break;
            
          case 'print':
            setIsPdfGenerating(true);
            try {
              const pdfResponse = await generateResumePDF(sessionId, jsonData);
              if (pdfResponse.success && pdfResponse.result) {
                await Linking.openURL(`${cdnUrl}${pdfResponse.result}`);
              } else {
                throw new Error('Failed to generate PDF');
              }
            } catch (printError) {
              console.error('PDF print error:', printError);
              Alert.alert('Error', 'Failed to generate PDF. Please try again.');
            }
            break;
        }
      } catch (jsonError) {
        console.log('Received non-JSON message:', message);
        // Non-JSON messages are handled above, so no need to throw an error here
      }
    } catch (error) {
      console.error('Error handling WebView message:', error);
      Alert.alert('Error', 'Failed to process the operation');
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        document.querySelectorAll('.resume-content').forEach(content => {
          content.contentEditable = ${!isEditing};
        });
        document.querySelectorAll('.drag-handle').forEach(handle => {
          handle.style.display = ${!isEditing ? "'block'" : "'none'"};
        });
        true;
      `);
    }
  };

  // Enhanced WebView content with improved drag-and-drop
  const getEnhancedHtml = (baseHtml) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
          ${getTemplateStyles()}
          <style>
            /* Visual feedback styles */
            .section {
              transition: all 0.2s ease;
              padding: 1rem;
              margin: 0.5rem 0;
              border-radius: 0.5rem;
              border: 2px solid transparent;
            }
            
            .section:hover {
              background: rgba(96, 165, 250, 0.1);
              border-color: rgba(96, 165, 250, 0.2);
            }
            
            .section.dragging {
              opacity: 0.5;
              border: 2px dashed #60a5fa;
            }
            
            .drag-handle {
              opacity: 0;
              transition: opacity 0.2s;
              position: absolute;
              left: -30px;
              top: 50%;
              transform: translateY(-50%);
              padding: 0.5rem;
              cursor: move;
              color: #60a5fa;
            }
            
            .section:hover .drag-handle {
              opacity: 1;
            }
            
            .drop-zone {
              height: 4px;
              background: transparent;
              margin: 0.25rem 0;
              transition: all 0.2s;
            }
            
            .drop-zone.active {
              height: 20px;
              background: rgba(96, 165, 250, 0.2);
              border-radius: 4px;
            }
            
            /* Toast notification */
            .toast {
              position: fixed;
              bottom: 20px;
              left: 50%;
              transform: translateX(-50%);
              background: rgba(96, 165, 250, 0.9);
              color: white;
              padding: 0.75rem 1.5rem;
              border-radius: 2rem;
              font-size: 0.875rem;
              z-index: 1000;
              opacity: 0;
              transition: opacity 0.3s;
            }
            
            .toast.visible {
              opacity: 1;
            }
            
            /* Page break styles */
            .page-break {
              border-top: 2px dashed #60a5fa;
              margin: 2rem 0;
              padding-top: 2rem;
              position: relative;
            }
            
            .page-break::before {
              content: 'Page Break';
              position: absolute;
              top: -0.75rem;
              left: 50%;
              transform: translateX(-50%);
              background: #60a5fa;
              color: white;
              padding: 0.25rem 0.75rem;
              border-radius: 1rem;
              font-size: 0.75rem;
            }
          </style>
        </head>
        <body>
          <div id="toast" class="toast"></div>
          ${baseHtml}
          <script>
            // Show toast notification
            function showToast(message, duration = 2000) {
              const toast = document.getElementById('toast');
              toast.textContent = message;
              toast.classList.add('visible');
              setTimeout(() => toast.classList.remove('visible'), duration);
            }
            
            // Initialize drag and drop
            document.querySelectorAll('.section').forEach(section => {
              const handle = document.createElement('div');
              handle.className = 'drag-handle';
              handle.innerHTML = '⋮⋮';
              section.appendChild(handle);
              
              // Create drop zones
              const dropZone = document.createElement('div');
              dropZone.className = 'drop-zone';
              section.parentNode.insertBefore(dropZone, section);
              
              // Add final drop zone after last section
              if (section === document.querySelector('.section:last-child')) {
                const finalDropZone = dropZone.cloneNode();
                section.parentNode.insertBefore(finalDropZone, section.nextSibling);
              }
              
              section.draggable = true;
              
              section.addEventListener('dragstart', e => {
                section.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
              });
              
              section.addEventListener('dragend', e => {
                section.classList.remove('dragging');
                document.querySelectorAll('.drop-zone').forEach(zone => 
                  zone.classList.remove('active')
                );
              });
            });
            
            // Handle drop zones
            document.querySelectorAll('.drop-zone').forEach(zone => {
              zone.addEventListener('dragover', e => {
                e.preventDefault();
                zone.classList.add('active');
              });
              
              zone.addEventListener('dragleave', e => {
                zone.classList.remove('active');
              });
              
              zone.addEventListener('drop', e => {
                e.preventDefault();
                const dragged = document.querySelector('.dragging');
                if (!dragged) return;
                
                zone.parentNode.insertBefore(dragged, zone.nextSibling);
                showToast('Section moved successfully');
                
                // Notify React Native
                window.ReactNativeWebView?.postMessage(JSON.stringify({
                  type: 'contentMoved',
                  message: 'Content reordered successfully'
                }));
              });
            });
            
            // Handle page breaks
            document.addEventListener('keydown', e => {
              if (e.key === 'Enter' && e.ctrlKey) {
                const selection = window.getSelection();
                if (!selection.rangeCount) return;
                
                const range = selection.getRangeAt(0);
                const pageBreak = document.createElement('div');
                pageBreak.className = 'page-break';
                
                range.insertNode(pageBreak);
                range.collapse();
                
                showToast('Page break added - Press Ctrl+Enter to add more');
              }
            });
            
            // Context menu for page breaks
            document.addEventListener('contextmenu', e => {
              const pageBreak = e.target.closest('.page-break');
              if (pageBreak) {
                e.preventDefault();
                if (confirm('Remove this page break?')) {
                  pageBreak.remove();
                  showToast('Page break removed');
                }
              }
            });
            
            // Enhanced print function
            window.printDocument = () => {
              // Remove drag handles and drop zones before printing
              document.querySelectorAll('.drag-handle, .drop-zone').forEach(el => 
                el.style.display = 'none'
              );
              
              const content = document.documentElement.outerHTML;
              window.ReactNativeWebView?.postMessage(JSON.stringify({
                type: 'print',
                content: content
              }));
              
              // Restore drag handles and drop zones
              setTimeout(() => {
                document.querySelectorAll('.drag-handle, .drop-zone').forEach(el => 
                  el.style.display = ''
                );
              }, 0);
            };
            
            // Initial setup notification
            showToast('Drag sections to reorder • Ctrl+Enter for page breaks', 4000);
          </script>
        </body>
      </html>
    `;
  };

  const injectJavaScript = (script) => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(script);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
    >
      <SafeAreaView className="flex-1 bg-[#0f1729]">
        <LinearGradient
          colors={['rgba(96,165,250,0.1)', 'transparent']}
          className="px-4 py-3 flex-row items-center justify-between border-b border-blue-500/20"
        >
          <Text className="text-white text-xl font-semibold">Resume Preview</Text>
          <View className="flex-row">
            <TouchableOpacity 
              onPress={toggleEditing}
              className="w-10 h-10 rounded-full border border-blue-500/20 items-center justify-center mr-2"
            >
              <LinearGradient
                colors={['rgba(96,165,250,0.1)', 'rgba(59,130,246,0.05)']}
                className="absolute inset-0 rounded-full"
              />
              <MaterialIcons name={isEditing ? "edit-off" : "edit"} size={20} color="#60a5fa" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handlePrint}
              disabled={isPdfGenerating}
              className="w-10 h-10 rounded-full border border-blue-500/20 items-center justify-center mr-2"
            >
              <LinearGradient
                colors={['rgba(96,165,250,0.1)', 'rgba(59,130,246,0.05)']}
                className="absolute inset-0 rounded-full"
              />
              {isPdfGenerating ? (
                <ActivityIndicator size="small" color="#60a5fa" />
              ) : (
                <MaterialIcons name="print" size={20} color="#60a5fa" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={onClose}
              className="w-10 h-10 rounded-full border border-blue-500/20 items-center justify-center"
            >
              <LinearGradient
                colors={['rgba(96,165,250,0.1)', 'rgba(59,130,246,0.05)']}
                className="absolute inset-0 rounded-full"
              />
              <Ionicons name="close" size={24} color="#60a5fa" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Status message */}
        <View className="px-4 py-2 bg-[#0f1729]">
          <Text className="text-blue-400 text-sm text-center">
            {isEditing 
              ? "Editing mode enabled - Make your changes"
              : "Drag the ⋮⋮ handle to reorder sections • Select text and tap + for page breaks"}
          </Text>
          <Text className="text-blue-400 text-xs text-center mt-1">
            {isEditing
              ? "Tap the edit button to finish editing"
              : "Tap edit to modify content • Tap Print to save as PDF"}
          </Text>
        </View>

        <View className="flex-1 relative">
          {(isLoading || isPdfGenerating) ? (
            <View className="absolute inset-0 z-10 flex items-center justify-center bg-[#0f1729]">
              <ActivityIndicator size="large" color="#60a5fa" />
              <Text className="text-blue-400 mt-4">
                {isPdfGenerating ? 'Generating PDF...' : 'Loading preview...'}
              </Text>
            </View>
          ) : error ? (
            <View className="flex-1 items-center justify-center p-6">
              <Text className="text-red-400 text-center text-lg">{error}</Text>
              <TouchableOpacity 
                onPress={onClose}
                className="bg-blue-500/20 px-4 py-2 rounded-full flex-row items-center mt-4"
              >
                <Ionicons name="arrow-back" size={20} color="#60a5fa" />
                <Text className="text-blue-400 ml-2">Go Back</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <WebView
              ref={webViewRef}
              originWhitelist={['*']}
              source={{ html: getEnhancedHtml(resumeHtml) }}
              style={{ flex: 1, backgroundColor: '#f0f0f0' }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              onMessage={onMessage}
              injectedJavaScript={`
                document.documentElement.style.userSelect = 'text';
                document.documentElement.style.webkitUserSelect = 'text';
                document.querySelectorAll('.resume-content').forEach(content => {
                  content.contentEditable = false;
                });
                true;
              `}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.error('WebView error:', nativeEvent);
                setError(`WebView error: ${nativeEvent.description}`);
              }}
              onLoadEnd={() => {
                setIsLoading(false);
                console.log('WebView loaded');
              }}
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default PreviewModal;