'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  TextField,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import { Send, AutoAwesome } from '@mui/icons-material';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { UserSidebar } from '@/components/layout/UserSidebar';
import { getRelevantLegalSection } from '@/lib/aiService';
import { DynamicTable, DynamicTableColumn } from '@/components/common/DynamicTable';

let personRowId = 0;
const createPersonRow = () => ({ id: ++personRowId, name: '', address: '', mobile: '' });

let evidenceRowId = 0;
const createEvidenceRow = () => ({ id: ++evidenceRowId, name: '', description: '', file: null as File | null });

type PersonRow = ReturnType<typeof createPersonRow>;
type EvidenceRow = ReturnType<typeof createEvidenceRow>;

const personColumns: DynamicTableColumn<PersonRow>[] = [
  { key: 'name', header: 'Name' },
  { key: 'address', header: 'Address' },
  { key: 'mobile', header: 'Mobile Number' },
];

const evidenceColumns: DynamicTableColumn<EvidenceRow>[] = [
  { key: 'name', header: 'Name of File' },
  { key: 'description', header: 'Description' },
  { key: 'file', header: 'File Upload', type: 'file' },
];

const complaintDescriptionPlaceholder = `
  •  What Happened? (Chronological Narrative): 
  Provide a step-by-step description of how the incident unfolded. Include the exact order of events from start to finish.
  
  •  Why Did It Happen? (Motive): 
  State the suspected reason behind the incident, such as a property dispute, financial fraud, cyber scam, or personal enmity.
  
  •  What Was Lost or Damaged? (Property Details): 
  List all stolen or damaged items with their estimated value and identifying numbers (e.g., phone IMEI numbers, laptop serials, or vehicle registration plates).
  
  •  Was Anyone Hurt? (Injuries Sustained): 
  Describe any physical injuries or severe mental distress caused. Mention if medical reports or doctor certificates are available.
  
  •  Were Weapons Involved? (Weapons Used): 
  Specify if the accused used any weapons, such as sticks, iron rods, firearms, sharp objects, or blunt instruments.
`;

export default function FileComplaintPage() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    incidentDate: '',
    incidentTime: '',
    incidentLocation: '',
    numKnownAccused: '',
    numUnknownAccused: '',
    unknownAccusedDescription: '',
  });
  const [knownAccusedRows, setKnownAccusedRows] = useState<PersonRow[]>([]);
  const [witnessRows, setWitnessRows] = useState<PersonRow[]>([]);
  const [evidenceRows, setEvidenceRows] = useState<EvidenceRow[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [relevantInfo, setRelevantInfo] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.description || !formData.incidentDate || !formData.incidentTime || !formData.incidentLocation) {
      alert('Please fill in all required fields');
      return;
    }
    setSubmitted(true);
    setFormData({
      description: '',
      incidentDate: '',
      incidentTime: '',
      incidentLocation: '',
      numKnownAccused: '',
      numUnknownAccused: '',
      unknownAccusedDescription: '',
    });
    setKnownAccusedRows([]);
    setWitnessRows([]);
    setEvidenceRows([]);
    setRelevantInfo('');
    setAiError('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleAiAssist = async () => {
    setAiError('');
    setAiLoading(true);
    try {
      const result = await getRelevantLegalSection(formData.description);
      setRelevantInfo(result);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Failed to get AI assistance');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden', bgcolor: 'background.default' }}>
        <UserSidebar />

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Form Area */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 5 }}>
            <Container maxWidth="md">
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
                File Your Complaint
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center', mb: 4 }}>
                Share your complaint details below and we&apos;ll get back to you soon
              </Typography>

              {submitted && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Thank you! Your complaint has been submitted successfully. We&apos;ll contact you soon.
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                

                {/* Incident Details */}
                <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
                  Incident Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Date"
                      name="incidentDate"
                      value={formData.incidentDate}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      fullWidth
                      type="time"
                      label="Time"
                      name="incidentTime"
                      value={formData.incidentTime}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      fullWidth
                      label="Location"
                      name="incidentLocation"
                      value={formData.incidentLocation}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                </Grid>

                {/* Accused Details */}
                <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
                  Accused Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Number of known accused"
                      name="numKnownAccused"
                      value={formData.numKnownAccused}
                      onChange={handleChange}
                      margin="normal"
                      variant="outlined"
                      slotProps={{ htmlInput: { min: 0 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Number of unknown accused"
                      name="numUnknownAccused"
                      value={formData.numUnknownAccused}
                      onChange={handleChange}
                      margin="normal"
                      variant="outlined"
                      slotProps={{ htmlInput: { min: 0 } }}
                    />
                  </Grid>
                </Grid>
                <DynamicTable
                  columns={personColumns}
                  rows={knownAccusedRows}
                  createRow={createPersonRow}
                  onRowsChange={setKnownAccusedRows}
                />


                <TextField
                  fullWidth
                  label="Physical Description of unknown accused"
                  name="unknownAccusedDescription"
                  value={formData.unknownAccusedDescription}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={3}
                  variant="outlined"
                  placeholder="approximate age, height, build, clothing, scars, tattoos, or accent"
                />


                {/* Witness Information */}
                <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
                  Witness Information
                </Typography>
                <DynamicTable
                  columns={personColumns}
                  rows={witnessRows}
                  createRow={createPersonRow}
                  onRowsChange={setWitnessRows}
                />

                {/* Evidence */}
                <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
                  Evidence
                </Typography>
                <DynamicTable
                  columns={evidenceColumns}
                  rows={evidenceRows}
                  createRow={createEvidenceRow}
                  onRowsChange={setEvidenceRows}
                />

                {/* Complaint Details */}
                <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 1 }}>
                  Complaint Details
                </Typography>

                {/* Complaint Information */}
                <TextField
                  fullWidth
                  label="Complaint Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  margin="normal"
                  required
                  multiline
                  minRows={10}
                  maxRows={10}
                  variant="outlined"
                  placeholder={complaintDescriptionPlaceholder}
                  sx={{
                    '& textarea::placeholder': {
                      fontSize: '0.875rem',
                      lineHeight: 1,
                      opacity: 0.75,
                    },
                  }}
                />

                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  sx={{ mt: 1 }}
                  startIcon={aiLoading ? <CircularProgress size={18} /> : <AutoAwesome />}
                  disabled={!formData.description.trim() || aiLoading}
                  onClick={handleAiAssist}
                >
                  {aiLoading ? 'Analyzing...' : 'AI Assist'}
                </Button>

                {aiError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {aiError}
                  </Alert>
                )}

                {relevantInfo && (
                  <TextField
                    fullWidth
                    label="Relevant Information"
                    value={relevantInfo}
                    margin="normal"
                    multiline
                    minRows={4}
                    maxRows={20}
                    variant="outlined"
                    slotProps={{ input: { readOnly: true } }}
                  />
                )}

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{ mt: 4, py: 1.5 }}
                  endIcon={<Send />}
                >
                  Submit Complaint
                </Button>
              </form>
            </Container>
            <Footer />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
