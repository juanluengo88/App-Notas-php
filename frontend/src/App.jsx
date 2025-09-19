import { useEffect, useState } from "react";
import axios from "axios";
import {
	Container,
	Typography,
	TextField,
	Button,
	Grid,
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Autocomplete,
} from "@mui/material";

import Note from "./components/note";

const backend = `http://${import.meta.env.VITE_BACKEND_URL}:${
	import.meta.env.VITE_BACKEND_PORT
}/api`;

export default function NotesApp() {
	const [notes, setNotes] = useState([]);
	const [categories, setCategories] = useState([]);
	const [noteInput, setNoteInput] = useState("");
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [categorySearch, setCategorySearch] = useState("");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogCategoryName, setDialogCategoryName] = useState("");
	const [currentEditingNote, setCurrentEditingNote] = useState(null);
	const [menuCategoryFilter, setMenuCategoryFilter] = useState(false);
	const [menuArchivedFilter, setMenuArchivedFilter] = useState(false);
	const [selectedCategoriesMenu, setSelectedCategoriesMenu] = useState([]);
	const [categorySearchMenu, setCategorySearchMenu] = useState("");

	const fetchNotes = async (useFilter = "") => {
		let filter = useFilter;
		const res = await axios.get(`${backend}/notes${filter}`);
		setNotes(res.data);
	};

	const fetchCategories = async () => {
		const res = await axios.get(`${backend}/category`);
		setCategories(res.data);
	};

	const createNote = async () => {
		const res = await axios.post(`${backend}/notes`, { notes: noteInput });
		const noteId = res.data;
		for (let catId of selectedCategories) {
			await axios.put(`${backend}/notes/${noteId}/category`, {
				id: catId,
			});
		}
		setNoteInput("");
		setSelectedCategories([]);
		fetchNotes();
	};

	const createCategory = async (name) => {
		if (!name.trim()) return;
		const existing = categories.find(
			(c) => c.name.toLowerCase() === name.trim().toLowerCase()
		);
		if (existing) {
			if (!selectedCategories.includes(existing.id)) {
				setSelectedCategories([...selectedCategories, existing.id]);
			}
			return;
		}
		const res = await axios.post(`${backend}/category`, {
			name,
		});
		const created = res.data;
		await fetchCategories();
		if (!selectedCategories.includes(created.id)) {
			setSelectedCategories([...selectedCategories, created.id]);
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			const match = categories.find(
				(cat) => cat.name.toLowerCase() === categorySearch.toLowerCase()
			);
			if (match) {
				if (!selectedCategories.includes(match.id)) {
					setSelectedCategories([...selectedCategories, match.id]);
				}
				setCategorySearch("");
			} else {
				setDialogCategoryName(categorySearch);
				setDialogOpen(true);
			}
		}
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
		setDialogCategoryName("");
	};

	const handleDialogConfirm = async () => {
		await createCategory(dialogCategoryName);
		handleDialogClose();
		setCategorySearch("");
	};

	useEffect(() => {
		fetchNotes();
		fetchCategories();
	}, []);

	useEffect(() => {
		if (selectedCategoriesMenu.length !== 0) {
			const cats = selectedCategoriesMenu.map(
				(cat_id) => categories.find((c) => c.id === cat_id)?.name
			);
			const filter = `?category=${cats.join(",")}&archived=${+!menuArchivedFilter}`;
			fetchNotes(filter);
		} else {
			fetchNotes();
		}
	}, [selectedCategoriesMenu]);

	return (
		<Container maxWidth="md" sx={{ mt: 4 }}>
			<Typography variant="h4" gutterBottom>
				Notes App
			</Typography>
			<Box mb={3}>
				<Typography variant="h6">Create new Note</Typography>
				<Box sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2, mb: 3 }}>
					<TextField
						label="Write a note..."
						multiline
						rows={4}
						fullWidth
						value={noteInput}
						onChange={(e) => setNoteInput(e.target.value)}
					/>
					<Box sx={{ display: "flex", gap: 2, my: 2 }}>
						<Autocomplete
							multiple
							noOptionsText={"Press enter to create a new category."}
							options={categories}
							getOptionLabel={(option) => option.name}
							filterSelectedOptions
							value={categories.filter((cat) =>
								selectedCategories.includes(cat.id)
							)}
							onChange={(event, newValue) => {
								setSelectedCategories(newValue.map((cat) => cat.id));
							}}
							inputValue={categorySearch}
							onInputChange={(event, newInputValue) => {
								if (event && newInputValue !== undefined) {
									event.preventDefault();
									setCategorySearch(newInputValue);
								}
							}}
							onKeyDown={handleKeyDown}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Select Categories"
									placeholder="Start typing..."
								/>
							)}
							sx={{ flex: 1 }}
						/>
					</Box>
					<Button variant="contained" onClick={createNote}>
						Add Note
					</Button>
				</Box>
			</Box>
			<Typography variant="h6">View my Notes</Typography>
			<Box sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2, mb: 3 }}>
				<Box
					sx={{ display: "flex", justifyContent: "flex-start", gap: 2, mb: 2 }}
				>
					<Button
						variant="outlined"
						onClick={(e) => {
							e.preventDefault();
							setMenuCategoryFilter((prevValue) => !prevValue);
							setSelectedCategoriesMenu([])
							setCategorySearchMenu("")
						}}
					>
						Filter by Category
					</Button>
					<Button
						variant="outlined"
						color={menuArchivedFilter ? "secondary" : "primary"}
						onClick={(e) => {
							e.preventDefault();
							setMenuArchivedFilter((prevValue) => !prevValue);
							fetchNotes(`?archived=${+menuArchivedFilter}`);
						}}
					>
						Filtering by {menuArchivedFilter ? "Archived" : "Active"}
					</Button>
				</Box>
				{menuCategoryFilter && (
					<Autocomplete
						multiple
						noOptionsText={"Press enter to create a new category."}
						options={categories}
						getOptionLabel={(option) => option.name}
						filterSelectedOptions
						value={categories.filter((cat) =>
							selectedCategoriesMenu.includes(cat.id)
						)}
						onChange={(event, newValue) => {
							setSelectedCategoriesMenu(newValue.map((cat) => cat.id));
						}}
						inputValue={categorySearchMenu}
						onInputChange={(event, newInputValue) => {
							if (event && newInputValue !== undefined) {
								event.preventDefault();
								setCategorySearchMenu(newInputValue);
							}
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Select Categories"
								placeholder="Start typing..."
							/>
						)}
						sx={{ flex: 1 }}
					/>
				)}
				<Grid container spacing={2}>
					{notes.map((note) => (
						<Note
							key={note.id}
							note={note}
							setCurrentEditingNote={setCurrentEditingNote}
							currentEditingNote={currentEditingNote}
							fetchNotes={fetchNotes}
							categories={categories}
							menuArchivedFilter={menuArchivedFilter}
						/>
					))}
				</Grid>
			</Box>
			<Dialog open={dialogOpen} onClose={handleDialogClose}>
				<DialogTitle>Create Category</DialogTitle>
				<DialogContent>
					<DialogContentText>
						"{dialogCategoryName}" does not exist. Would you like to create it?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDialogClose}>Cancel</Button>
					<Button onClick={handleDialogConfirm} autoFocus>
						Create
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
}
