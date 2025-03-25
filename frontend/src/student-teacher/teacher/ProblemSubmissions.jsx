import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Download, Eye, FileText, GripVertical, ArrowUp, ArrowDown, Info, BarChart, PieChart, LineChart } from 'lucide-react';
import './ProblemSubmissions.css';

const ProblemSubmissions = ({ problemId }) => {
  const [problem, setProblem] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'asc' });
  const [showRubricInfo, setShowRubricInfo] = useState(false);
  
  // Fetch problem data and submissions
  useEffect(() => {
    const fetchProblemData = async () => {
      try {
        setLoading(true);
        
        // This would be replaced with your actual API endpoint
        const problemResponse = await fetch(`/api/problems/${problemId}`);
        const submissionsResponse = await fetch(`/api/problems/${problemId}/submissions`);
        
        if (!problemResponse.ok || !submissionsResponse.ok) {
          throw new Error('Failed to fetch problem data');
        }
        
        const problemData = await problemResponse.json();
        const submissionsData = await submissionsResponse.json();
        
        setProblem(problemData);
        setSubmissions(submissionsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        
        // For demo purposes, set mock data if API fails
        const mockProblem = {
          id: problemId || '1',
          title: "Advanced Calculus Problem Set",
          description: "Solve the following problems related to multivariable calculus and optimization. Focus on partial derivatives, gradient vectors, and Lagrange multipliers for constrained optimization problems.",
          subject: "Mathematics",
          createdAt: "2023-10-15",
          teacherParameters: [
            { id: 1, name: "Technical Accuracy", weight: 5, description: "Correctness of mathematical procedures and calculations" },
            { id: 2, name: "Problem Approach", weight: 4, description: "Strategy and methodology used to solve problems" },
            { id: 3, name: "Completeness", weight: 3, description: "Addressing all parts of each problem" }
          ],
          defaultParameters: [
            { id: 4, name: "Clarity", weight: 3, description: "Clear presentation of solutions" },
            { id: 5, name: "Organization", weight: 2, description: "Logical flow and structure" },
            { id: 6, name: "Creativity", weight: 2, description: "Novel approaches or insights" },
            { id: 7, name: "Depth", weight: 3, description: "Thorough exploration of concepts" }
          ]
        };
        
        // Generate 10 mock submissions
        const mockSubmissions = Array.from({ length: 10 }, (_, i) => {
          // Generate random scores for each parameter
          const teacherParamScores = mockProblem.teacherParameters.map(param => ({
            parameterId: param.id,
            score: Math.floor(Math.random() * 10) + 1, // Random score between 1-10
            weight: param.weight
          }));
          
          const defaultParamScores = mockProblem.defaultParameters.map(param => ({
            parameterId: param.id,
            score: Math.floor(Math.random() * 10) + 1, // Random score between 1-10
            weight: param.weight
          }));
          
          // Calculate weighted averages
          const teacherTotal = teacherParamScores.reduce((sum, p) => sum + (p.score * p.weight), 0);
          const teacherWeightSum = mockProblem.teacherParameters.reduce((sum, p) => sum + p.weight, 0);
          const teacherAvg = teacherTotal / teacherWeightSum;
          
          const defaultTotal = defaultParamScores.reduce((sum, p) => sum + (p.score * p.weight), 0);
          const defaultWeightSum = mockProblem.defaultParameters.reduce((sum, p) => sum + p.weight, 0);
          const defaultAvg = defaultTotal / defaultWeightSum;
          
          // Overall average
          const overallAvg = (teacherTotal + defaultTotal) / (teacherWeightSum + defaultWeightSum);
          
          return {
            id: `sub_${i + 1}`,
            studentId: `student_${i + 1}`,
            studentName: `Student ${i + 1}`,
            rank: i + 1, // Initial rank
            submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            fileType: ['pdf', 'docx', 'zip'][Math.floor(Math.random() * 3)],
            parameterScores: [...teacherParamScores, ...defaultParamScores],
            teacherAverage: teacherAvg.toFixed(1),
            defaultAverage: defaultAvg.toFixed(1),
            overallScore: overallAvg.toFixed(1)
          };
        });
        
        // Sort by overall score descending
        mockSubmissions.sort((a, b) => parseFloat(b.overallScore) - parseFloat(a.overallScore));
        
        // Assign ranks
        mockSubmissions.forEach((sub, idx) => {
          sub.rank = idx + 1;
        });
        
        setProblem(mockProblem);
        setSubmissions(mockSubmissions);
      }
    };

    fetchProblemData();
  }, [problemId]);

  // Handle drag end for reordering
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    // Create a copy of the submissions array
    const items = Array.from(submissions);
    
    // Remove the dragged item
    const [reorderedItem] = items.splice(sourceIndex, 1);
    
    // Insert the item at the new position
    items.splice(destinationIndex, 0, reorderedItem);
    
    // Update ranks - ranks are fixed from 1-10, so we're just changing which student has which rank
    const updatedItems = items.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
    
    setSubmissions(updatedItems);
    
    // In a real application, you would send the updated ranks to your backend
    // saveRanksToBackend(updatedItems);
  };

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    
    const sortedSubmissions = [...submissions].sort((a, b) => {
      if (key === 'rank' || key === 'overallScore' || key.startsWith('param_')) {
        // Numeric sorting
        const aValue = key === 'rank' ? a[key] : 
                      key === 'overallScore' ? parseFloat(a[key]) : 
                      a.parameterScores.find(p => p.parameterId === parseInt(key.split('_')[1]))?.score || 0;
                      
        const bValue = key === 'rank' ? b[key] : 
                      key === 'overallScore' ? parseFloat(b[key]) : 
                      b.parameterScores.find(p => p.parameterId === parseInt(key.split('_')[1]))?.score || 0;
        
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      } else {
        // String sorting
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
      }
    });
    
    // After sorting, we need to reassign ranks from 1-10
    const rankedSubmissions = sortedSubmissions.map((sub, idx) => ({
      ...sub,
      rank: idx + 1
    }));
    
    setSubmissions(rankedSubmissions);
  };

  // Helper function to get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ArrowUp className="sort-icon" /> : <ArrowDown className="sort-icon" />;
  };

// Helper function to get file type icon
const getFileTypeIcon = (type) => {
  if (!type) return '📄'; // Default icon for unknown types

  switch (type.toLowerCase()) {
    case 'pdf':
      return '📄';
    case 'docx':
    case 'doc':
      return '📝';
    case 'ppt':
    case 'pptx':
      return '📊';
    case 'zip':
    case 'rar':
    case '7z':
      return '📦';
    case 'py':
      return '🐍';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'svg':
      return '🖼️'; // Image icon
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'flac':
      return '🎵'; // Audio icon
    case 'mp4':
    case 'avi':
    case 'mkv':
    case 'mov':
    case 'webm':
      return '🎥'; // Video icon
    default:
      return '📄'; // Default document icon
  }
};

  // Handle file download
  const handleDownload = (submissionId, studentName, fileType) => {
    // In a real application, this would make an API call to download the file
    console.log(`Downloading submission ${submissionId} from ${studentName}`);
    
    // Mock download functionality
    alert(`Downloading ${studentName}'s submission (${fileType.toUpperCase()})`);
  };

  // Handle view submission
  const handleViewSubmission = (submissionId, studentName) => {
    // In a real application, this would navigate to a submission view page
    console.log(`Viewing submission ${submissionId} from ${studentName}`);
    
    // Mock view functionality
    alert(`Viewing ${studentName}'s submission details`);
  };

  // Calculate statistics for charts
  const calculateStats = () => {
    if (!submissions || submissions.length === 0) return null;
    
    // File type distribution for pie chart
    const fileTypes = {};
    submissions.forEach(sub => {
      fileTypes[sub.fileType] = (fileTypes[sub.fileType] || 0) + 1;
    });
    
    // Average scores by parameter for bar chart
    const paramScores = {};
    problem.teacherParameters.concat(problem.defaultParameters).forEach(param => {
      let total = 0;
      let count = 0;
      
      submissions.forEach(sub => {
        const score = sub.parameterScores.find(p => p.parameterId === param.id)?.score;
        if (score) {
          total += score;
          count++;
        }
      });
      
      paramScores[param.name] = count > 0 ? (total / count).toFixed(1) : 0;
    });
    
    // Score distribution for line chart
    const scoreDistribution = {
      '1-2': 0,
      '3-4': 0,
      '5-6': 0,
      '7-8': 0,
      '9-10': 0
    };
    
    submissions.forEach(sub => {
      const score = parseFloat(sub.overallScore);
      if (score <= 2) scoreDistribution['1-2']++;
      else if (score <= 4) scoreDistribution['3-4']++;
      else if (score <= 6) scoreDistribution['5-6']++;
      else if (score <= 8) scoreDistribution['7-8']++;
      else scoreDistribution['9-10']++;
    });
    
    return { fileTypes, paramScores, scoreDistribution };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div class="loading-overlay">
        <div class="loading-container">
          <div class="loading-spinner"></div>
            <div class="loading-text">Loading...</div>
        </div>
      </div>
    );
  }

  if (error && !problem) {
    return (
      <div className="problem-submissions-container">
        <div className="error-message">
          <h2>Error Loading Data</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="problem-submissions-container">
      <div className="page-title">
        <h1>Submissions Page</h1>
      </div>
      
      <div className="problem-header">
        <h2>{problem.title}</h2>
        <div className="problem-meta">
          <span className="subject">{problem.subject}</span>
          <span className="submissions-count">{submissions.length} Submissions</span>
        </div>
        <p className="description">{problem.description}</p>
      </div>

      <div className="rubric-header">
        <h3>Submission Rubric</h3>
        <button 
          className="info-button"
          onClick={() => setShowRubricInfo(!showRubricInfo)}
        >
          <Info className="info-icon" />
          {showRubricInfo ? 'Hide Rubric Info' : 'Show Rubric Info'}
        </button>
      </div>

      {showRubricInfo && (
        <div className="rubric-info">
          <div className="rubric-section">
            <h4>Teacher Parameters</h4>
            <div className="parameters-list">
              {problem.teacherParameters.map(param => (
                <div key={param.id} className="parameter-item">
                  <div className="parameter-name">
                    <strong>{param.name}</strong> (Weight: {param.weight})
                  </div>
                  <div className="parameter-description">{param.description}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="rubric-section">
            <h4>Default Parameters</h4>
            <div className="parameters-list">
              {problem.defaultParameters.map(param => (
                <div key={param.id} className="parameter-item">
                  <div className="parameter-name">
                    <strong>{param.name}</strong> (Weight: {param.weight})
                  </div>
                  <div className="parameter-description">{param.description}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="rubric-note">
            <p>
              <strong>Note:</strong> Scores for each parameter range from 1-10. The final score is a weighted average of all parameters.
              Drag and drop rows to manually adjust student rankings if needed.
            </p>
          </div>
        </div>
      )}

      <div className="rubric-table-container">
        <DragDropContext onDragEnd={handleDragEnd}>
          <table className="rubric-table">
            <thead>
              <tr>
                <th className="drag-handle-col"></th>
                <th className="rank-col" onClick={() => requestSort('rank')}>
                  Rank {getSortIndicator('rank')}
                </th>
                <th onClick={() => requestSort('studentName')}>
                  Student Name {getSortIndicator('studentName')}
                </th>
                
                {/* Teacher Parameters */}
                {problem.teacherParameters.map(param => (
                  <th key={param.id} onClick={() => requestSort(`param_${param.id}`)}>
                    {param.name} (x{param.weight}) {getSortIndicator(`param_${param.id}`)}
                  </th>
                ))}
                
                <th onClick={() => requestSort('teacherAverage')}>
                  Teacher Criteria Avg {getSortIndicator('teacherAverage')}
                </th>
                
                {/* Default Parameters - Collapsed into one column */}
                <th onClick={() => requestSort('defaultAverage')}>
                  Core Criteria Avg {getSortIndicator('defaultAverage')}
                </th>
                
                <th onClick={() => requestSort('overallScore')}>
                  Overall Score {getSortIndicator('overallScore')}
                </th>
                
                <th className="file-col">Submission</th>
              </tr>
            </thead>
            
            <Droppable droppableId="submissions" direction="vertical">
              {(provided) => (
                <tbody
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {submissions.map((submission, index) => (
                    <Draggable key={submission.id} draggableId={submission.id} index={index}>
                      {(provided, snapshot) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={snapshot.isDragging ? 'dragging' : ''}
                        >
                          <td className="drag-handle-col" {...provided.dragHandleProps}>
                            <GripVertical className="drag-handle" />
                          </td>
                          <td className="rank-col">{submission.rank}</td>
                          <td className="student-name">{submission.studentName}</td>
                          
                          {/* Teacher Parameters Scores */}
                          {problem.teacherParameters.map(param => {
                            const paramScore = submission.parameterScores.find(p => p.parameterId === param.id);
                            return (
                              <td key={param.id} className="score-cell">
                                <div className="score-display">
                                  <span className="score-value">{paramScore?.score || '-'}</span>
                                  <div 
                                    className="score-bar" 
                                    style={{ width: `${(paramScore?.score || 0) * 10}%` }}
                                  ></div>
                                </div>
                              </td>
                            );
                          })}
                          
                          <td className="average-cell">{submission.teacherAverage}</td>
                          <td className="average-cell">{submission.defaultAverage}</td>
                          <td className="overall-score">{submission.overallScore}</td>
                          
                          <td className="file-actions">
                            <div className="file-type">
                              {getFileTypeIcon(submission.fileType)} {submission.fileType.toUpperCase()}
                            </div>
                            <div className="file-buttons">
                              <button 
                                className="view-button"
                                onClick={() => handleViewSubmission(submission.id, submission.studentName)}
                                title={`View ${submission.studentName}'s submission`}
                              >
                                <Eye className="button-icon" />
                              </button>
                              <button 
                                className="download-button"
                                onClick={() => handleDownload(submission.id, submission.studentName, submission.fileType)}
                                title={`Download ${submission.studentName}'s submission`}
                              >
                                <Download className="button-icon" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          </table>
        </DragDropContext>
      </div>

      {/* Data Visualization Section */}
      <div className="data-visualization-section">
        <h3>Submission Analytics</h3>
        
        <div className="charts-container">
          {/* File Type Distribution Pie Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <PieChart className="chart-icon" />
              <h4>File Type Distribution</h4>
            </div>
            <div className="pie-chart">
              {stats && Object.entries(stats.fileTypes).map(([type, count], index) => (
                <div key={type} className="pie-segment" style={{
                  '--segment-color': index === 0 ? '#748CAB' : index === 1 ? '#3E5C76' : '#F0EBD8',
                  '--segment-percentage': `${(count / submissions.length) * 100}%`
                }}>
                  <div className="segment-label">
                    <span className="file-dot" style={{ backgroundColor: index === 0 ? '#748CAB' : index === 1 ? '#3E5C76' : '#F0EBD8' }}></span>
                    {type.toUpperCase()}: {count} ({Math.round((count / submissions.length) * 100)}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Parameter Average Scores Bar Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <BarChart className="chart-icon" />
              <h4>Average Parameter Scores</h4>
            </div>
            <div className="bar-chart">
              {stats && Object.entries(stats.paramScores).map(([param, score], index) => (
                <div key={param} className="bar-container">
                  <div className="bar-label">{param}</div>
                  <div className="bar-wrapper">
                    <div 
                      className="bar" 
                      style={{ 
                        width: `${parseFloat(score) * 10}%`,
                        backgroundColor: index % 2 === 0 ? '#748CAB' : '#3E5C76'
                      }}
                    ></div>
                    <span className="bar-value">{score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Score Distribution Line Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <LineChart className="chart-icon" />
              <h4>Score Distribution</h4>
            </div>
            <div className="line-chart">
              {stats && Object.entries(stats.scoreDistribution).map(([range, count], index, array) => (
                <div key={range} className="line-point" style={{
                  '--point-height': `${(count / Math.max(...Object.values(stats.scoreDistribution))) * 100}%`,
                  '--point-position': `${(index / (array.length - 1)) * 100}%`
                }}>
                  <div className="point-marker"></div>
                  <div className="point-label">{range}</div>
                  <div className="point-value">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSubmissions;
