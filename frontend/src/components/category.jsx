import { Button, Chip } from "@mui/material";

import { Close } from "@mui/icons-material";

const Category = ({
	editMode,
	cat,
	setCategoriesToDelete,
	setCurrentEditingNote,
}) => {
	return (
		<div>
			<Chip label={cat.name} size="medium" />
			{editMode && (
				<Button
					color="error"
					onClick={(e) => {
						e.preventDefault();
						setCurrentEditingNote((currentEditingNote) => {
							const newCats = [];

							for (const category of currentEditingNote.categories) {
								if (category.id !== cat.id) {
									newCats.push(category);
								}
							}

							return { ...currentEditingNote, Categories: newCats };
						});

						setCategoriesToDelete((prevCats) => [...prevCats, cat]);
					}}
				>
					<Close />
				</Button>
			)}
		</div>
	);
};

export default Category;
