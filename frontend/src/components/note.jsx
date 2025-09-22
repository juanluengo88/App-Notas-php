import axios from "axios";
import { useState } from "react";

import {
	Grid,
	Stack,
	TextField,
	Button,
	Card,
	Typography,
	CardActions,
	CardContent,
	Autocomplete,
} from "@mui/material";

import { Edit, Save, Delete, Archive } from "@mui/icons-material";
import Category from "./category";

const backend = `http://${import.meta.env.VITE_BACKEND_URL}:${
	import.meta.env.VITE_BACKEND_PORT
}/api`;

const Note = ({
	note,
	fetchNotes,
	categories,
	currentEditingNote,
	menuArchivedFilter,
	setCurrentEditingNote,
}) => {
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [categoriesToDelete, setCategoriesToDelete] = useState([]);
	const [categorySearch, setCategorySearch] = useState("");

	const editMode =
		currentEditingNote !== null && currentEditingNote.id === note.id;

	const deleteNote = async (id) => {
		await axios.delete(`${backend}/notes/${id}`);
		fetchNotes();
	};

	const archiveNote = async (id) => {
		await axios.put(`${backend}/notes/${id}`, { archived: +!note.archived });
		fetchNotes(`?archived=${+!menuArchivedFilter}`);
	};

	const updateCurrentEditingNote = async () => {
		await axios.put(`${backend}/notes/${currentEditingNote.id}`, {
			notes: currentEditingNote.notes,
		});
	};

	const deleteSelectedCategories = async (cat) => {
		await axios.delete(
			`${backend}/notes/${currentEditingNote.id}/category/${cat.id}`
		);
	};

	const addSelectedCategory = async (catId) => {
		await axios.put(`${backend}/notes/${currentEditingNote.id}/category`, {
			id: catId,
		});
	};

	const endEditingMode = async () => {
		await updateCurrentEditingNote();
		if (selectedCategories != []) {
			for (const cat of selectedCategories) {
				await addSelectedCategory(cat);
			}
			setSelectedCategories([]);
		}
		if (categoriesToDelete != []) {
			for (const cat of categoriesToDelete) {
				await deleteSelectedCategories(cat);
			}
			setCategoriesToDelete([]);
		}
		setCurrentEditingNote(null);
		fetchNotes();
	};

	return (
		<Grid item xs={12} sm={6}>
			<Card>
				<CardContent>
					{editMode ? (
						<TextField
							style={{ paddingBottom: "5px" }}
							value={currentEditingNote.notes}
							onChange={(e) =>
								setCurrentEditingNote((prev_note) => ({
									...prev_note,
									notes: e.target.value,
								}))
							}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									updateCurrentEditingNote();
								}
							}}
						/>
					) : (
						<Typography variant="body1" gutterBottom>
							{note.notes}
						</Typography>
					)}
					{editMode && (
						<Autocomplete
							multiple
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
							renderInput={(params) => (
								<TextField
									{...params}
									label="Select Categories"
									placeholder="Start typing..."
								/>
							)}
						/>
					)}
					{note.categories && note.categories.length > 0 && (
						<Stack direction="row" spacing={1} flexWrap="wrap">
							{editMode
								? currentEditingNote.categories.map((cat) => (
										<Category
											key={cat.id}
											cat={cat}
											editMode={editMode}
											setCategoriesToDelete={setCategoriesToDelete}
											setCurrentEditingNote={setCurrentEditingNote}
										/>
								  ))
								: note.categories.map((cat) => (
										<Category
											key={cat.id}
											cat={cat}
											editMode={editMode}
											setCategoriesToDelete={setCategoriesToDelete}
											setCurrentEditingNote={setCurrentEditingNote}
										/>
								  ))}
						</Stack>
					)}
				</CardContent>
				<CardActions>
					<Button
						onClick={(e) => {
							e.preventDefault();
							if (
								currentEditingNote !== null &&
								currentEditingNote.id === note.id
							) {
								endEditingMode();
							} else {
								setCurrentEditingNote(note);
							}
						}}
					>
						{editMode ? <Save /> : <Edit />}
					</Button>
					<Button
						color="secondary"
						onClick={(e) => {
							e.preventDefault();
							archiveNote(note.id);
						}}
					>
						<Archive />
					</Button>
					<Button color="error" onClick={() => deleteNote(note.id)}>
						<Delete />
					</Button>
				</CardActions>
			</Card>
		</Grid>
	);
};

export default Note;
