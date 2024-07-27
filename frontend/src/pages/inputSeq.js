import { useState, useEffect } from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../GoogleLoginButton.js'; // 경로 확인
import './inputSeq.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faTrash } from '@fortawesome/free-solid-svg-icons';
import uploadIcon from './upload_icon.png';

function InputSeq() {
  let navigate = useNavigate();



  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);


  useEffect(() => {
    setShowModal(true);
    return () => {
      document.body.style.overflow = 'auto';  // 오버플로우 기본값으로 재설정
    };
  }, []);

  /*-----------다솔님 코드 구현 함수, 변수---------------*/
  const [editingFileIndex, setEditingFileIndex] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [sequences, setSequences] = useState([{ id: 1, name: 'Sequence 1', value: '', visible: true }]);
  const [editingId, setEditingId] = useState(null);
  const [nextId, setNextId] = useState(2);


  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({ name: file.name, file }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
    setEditingFileIndex(null);
  };

  const handleFileNameChange = (index, name) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles[index] = { ...updatedFiles[index], name };
    setUploadedFiles(updatedFiles);
  };

  const deleteUploadedFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };
  const toggleVisibility = (id) => {
    setSequences(sequences.map(seq => seq.id === id ? { ...seq, visible: !seq.visible } : seq));
  };

  const handleNameChange = (id, name) => {
    setSequences(sequences.map(seq => seq.id === id ? { ...seq, name } : seq));
  };

  const deleteSequence = (id) => {
    setSequences(sequences.filter(seq => seq.id !== id));
  };

  const handleSequenceChange = (id, value) => {
    setSequences(sequences.map(seq => seq.id === id ? { ...seq, value } : seq));
  };
  const addSequence = (event) => {
    event.preventDefault();
    setSequences([...sequences, { id: nextId, name: `Sequence ${nextId}`, value: '', visible: true }]);
    setNextId(nextId + 1);
  };


  return (

    <div>



      <div className="container mt-4" style={{ marginLeft: '75px' }}>


        <Form>

          <h5 className="RS-id">Reference Sequence ID</h5>
          <Row className="align-items-center">
            <Col md={6}>
              <Form.Group controlId="referenceSequenceId">
                <Form.Control type="text" placeholder="Enter sequence ID" className="input-field" />
              </Form.Group>
            </Col>
            <Col md={1} className="d-flex justify-content-end align-items-center">
              <Button variant="primary" className="done-button">DONE</Button>
            </Col>
          </Row>

        </Form>



        <Form>

          <div className="mb-5"></div>

          <h5 className="RS-id">Variant Sequence</h5>

          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Upload File</Form.Label>
            {/* ------------다솔님 업로드 박스--------시작------- */}
            <Row className="align-items-center">
              <Col md={6}>
                <div className="upload-box">
                  <input type="file" className="file-input" accept=".fasta" multiple onChange={handleFileUpload} />
                  <div className="upload-text"><img src={uploadIcon} alt="Upload Icon" className="upload-icon" /><p>Drag your FASTA files here</p></div>
                </div>
                {uploadedFiles.map((uploadedFile, index) => (
                  <div key={index} className="uploaded-file">
                    {editingFileIndex === index ? (
                      <input
                        type="text"
                        value={uploadedFile.name}
                        onChange={(e) => handleFileNameChange(index, e.target.value)}
                        onBlur={() => setEditingFileIndex(null)}
                        className="edit-file-name-input"
                        autoFocus
                      />
                    ) : (
                      <span onClick={() => setEditingFileIndex(index)}>{uploadedFile.name}</span>
                    )}
                    <FontAwesomeIcon icon={faTrash} className="delete-icon" onClick={() => deleteUploadedFile(index)} />
                  </div>
                ))}
              </Col>
            </Row>
            {/* ------------다솔님 업로드 박스--------끝------- */}
          </Form.Group>

          {/* -----------------다솔님 Paste Sequence ------------시작---- */}
          <Form.Group>
            <Form.Label>Paste Sequence</Form.Label>
            <Row>
              <Col md={9} className="text-left">
                {sequences.map(seq => (
                  <div key={seq.id} className="form-group">
                    <div className="sequence-header d-flex align-items-center justify-content-start"> {/* justify-content-start 클래스 추가 */}
                      <FontAwesomeIcon icon={seq.visible ? faChevronDown : faChevronRight} className="chevron-icon" onClick={() => toggleVisibility(seq.id)} />
                      {editingId === seq.id ? (
                        <input
                          type="text"
                          value={seq.name}
                          onChange={(e) => handleNameChange(seq.id, e.target.value)}
                          onBlur={() => setEditingId(null)}
                          className="edit-name-input"
                          autoFocus
                        />
                      ) : (
                        <span onClick={() => setEditingId(seq.id)}>{seq.name}</span>
                      )}
                      <FontAwesomeIcon icon={faTrash} className="delete-icon" onClick={() => deleteSequence(seq.id)} />
                    </div>
                    {seq.visible && (
                      <textarea
                        placeholder="TAGCTAGCCGATCG....."
                        value={seq.value}
                        onChange={(e) => handleSequenceChange(seq.id, e.target.value)}
                        className="w-100"
                      />
                    )}
                  </div>
                ))}
              </Col>
            </Row>
          </Form.Group>

          <button onClick={addSequence} className="add-sequence-button">+ Add Sequence</button>
          {/* -----------------다솔님 Paste Sequence ------------끝---- */}


          <Row>
            <Col className="d-flex justify-content-end">

              <h4 className="next-page" onClick={() => { navigate('/analysis') }}>{'Next ➔'}</h4>
            </Col>
          </Row>

        </Form>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header className="modal-body-centered">
          <Modal.Title>Welcome to VirusDecode!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-centered">
          Log in/ Sign up to get your<br />
          virus analysis records.
          <div className="google-login-button-container">
            <GoogleLoginButton />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <p className='logged-out' onClick={handleCloseModal}>
            Stay logged out
          </p>
        </Modal.Footer>
      </Modal>


    </div>
  );
}

export default InputSeq;
