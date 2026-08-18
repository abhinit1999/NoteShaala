-- Rename file_path to protected_file_url to match the frontend codebase
ALTER TABLE public.products 
RENAME COLUMN file_path TO protected_file_url;
