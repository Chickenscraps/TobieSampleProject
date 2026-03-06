# Data Model Documentation

## Core Entities

### Users
- **Fields:**  
  - `id`: Unique identifier  
  - `username`: User's login name  
  - `email`: User's email address  
  - `created_at`: Date and time the user was created  

- **Indexes:**  
  - `username` (unique)

- **Retention Policy:**  
  - User data retained for as long as they have an active account.

### Chat Sessions
- **Fields:**  
  - `id`: Unique identifier  
  - `user_id`: Reference to the user  
  - `started_at`: Timestamp when session started  
  - `ended_at`: Timestamp when session ended  

- **Indexes:**  
  - `user_id`

- **Retention Policy:**  
  - Retained for 6 months after session ends.

### Chat Messages
- **Fields:**  
  - `id`: Unique identifier  
  - `session_id`: Reference to the chat session  
  - `sender_id`: Reference to the user sending the message  
  - `message_text`: Content of the message  
  - `sent_at`: Timestamp when the message was sent  

- **Indexes:**  
  - `session_id`  
  - `sender_id`

- **Retention Policy:**  
  - Retained for 1 year.

### Retrieval Events
- **Fields:**  
  - `id`: Unique identifier  
  - `session_id`: Reference to the chat session  
  - `retrieved_at`: Timestamp when the data was retrieved  
  - `data`: The data that was retrieved  

- **Indexes:**  
  - `session_id`

- **Retention Policy:**  
  - Retained for 1 year.

### Evidence Packs
- **Fields:**  
  - `id`: Unique identifier  
  - `user_id`: Reference to the user  
  - `created_at`: Timestamp when the evidence pack was created  
  - `status`: Status of the evidence pack (pending, submitted, reviewed)  

- **Indexes:**  
  - `user_id`

- **Retention Policy:**  
  - Retained for 2 years.

### Model Runs
- **Fields:**  
  - `id`: Unique identifier  
  - `model_version`: Version of the model used  
  - `run_at`: Timestamp when the model was run  
  - `parameters`: Parameters used in the model run  

- **Indexes:**  
  - `model_version`

- **Retention Policy:**  
  - Retained for 1 year.

### Validation Results
- **Fields:**  
  - `id`: Unique identifier  
  - `run_id`: Reference to the model run  
  - `validation_score`: Score from the validation process  
  - `validated_at`: Timestamp when validation was conducted  

- **Indexes:**  
  - `run_id`

- **Retention Policy:**  
  - Retained for 1 year.

### Assistant Publications
- **Fields:**  
  - `id`: Unique identifier  
  - `title`: Title of the publication  
  - `content`: Content of the publication  
  - `published_at`: Timestamp when published  

- **Indexes:**  
  - `title`

- **Retention Policy:**  
  - Retained indefinitely or until retracted.

### Source Documents
- **Fields:**  
  - `id`: Unique identifier  
  - `title`: Title of the source document  
  - `uploaded_at`: Timestamp when uploaded  
  - `file_path`: Path to the document file  

- **Indexes:**  
  - `title`

- **Retention Policy:**  
  - Retained indefinitely unless deleted by the user.

### Source Versions
- **Fields:**  
  - `id`: Unique identifier  
  - `document_id`: Reference to the source document  
  - `version_number`: Version number of the document  
  - `created_at`: Timestamp for this version creation  

- **Indexes:**  
  - `document_id`

- **Retention Policy:**  
  - Retained indefinitely unless deleted by the user.

### Source Chunks
- **Fields:**  
  - `id`: Unique identifier  
  - `version_id`: Reference to the source version  
  - `chunk_number`: Number of the chunk  
  - `content`: Text content of the chunk  

- **Indexes:**  
  - `version_id`

- **Retention Policy:**  
  - Retained indefinitely unless deleted by the user.

### Admin Events
- **Fields:**  
  - `id`: Unique identifier  
  - `admin_id`: Reference to the admin user  
  - `event_type`: Type of admin event  
  - `event_timestamp`: Timestamp of event  

- **Indexes:**  
  - `admin_id`

- **Retention Policy:**  
  - Retained for 2 years.

### Exports
- **Fields:**  
  - `id`: Unique identifier  
  - `user_id`: Reference to the user who exported  
  - `exported_at`: Timestamp when the export was initiated  
  - `format`: Format of the exported data (CSV, JSON, etc.)  

- **Indexes:**  
  - `user_id`

- **Retention Policy:**  
  - Retained for 1 year.

### Review Records
- **Fields:**  
  - `id`: Unique identifier  
  - `evidence_pack_id`: Reference to the evidence pack  
  - `reviewed_by`: User who reviewed the pack  
  - `reviewed_at`: Timestamp when the review was conducted  
  - `status`: Status of the review (approved, rejected)

- **Indexes:**  
  - `evidence_pack_id`

- **Retention Policy:**  
  - Retained for 2 years.

---

This documentation defines the core entities in the system, their fields, indexes, and retention policies for better understanding and management of data.