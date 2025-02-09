document.addEventListener('DOMContentLoaded', async function () {
	const form = document.getElementById('userForm')
	const taskList = document.getElementById('taskList')
	const alertText = document.getElementById('alertText')
	const alertTextSuccess = document.getElementById('alertTextSuccess')
	const url = 'https://capstone-server-last.onrender.com/api/v1'
	const token = localStorage.getItem('token')

	const initializeAlert = (element) => {
		if (element) {
			element.innerText = ''
			element.style.display = 'none'
		}
	}
	initializeAlert(alertText)
	initializeAlert(alertTextSuccess)

	const alertMsg = (element, message) => {
		if (element) {
			element.innerText = message
			element.style.display = 'block'
			setTimeout(() => {
				element.style.display = 'none'
			}, 5000)
		}
	}

	if (
		!token &&
		(window.location.pathname.endsWith('index.html') ||
			window.location.pathname === '/') &&
		!window.location.pathname.endsWith('login.html')
	) {
		window.location.href = 'login.html'
		alertMsg(alertText, 'You must be logged in first')
	}

	// -------------------------------------------------- Register Logic --------------------------------------------

	const registerForm = document.getElementById('register-form')

	const register = async (e) => {
		e.preventDefault()

		const info = {
			name: registerForm.name.value,
			email: registerForm.email.value,
			password: registerForm.password.value,
		}

		if (!info.name || !info.email || !info.password) {
			console.error('Fields cannot be empty')
			return
		}

		try {
			const response = await fetch(`${url}/auth/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(info),
			})

			const data = await response.json()

			if (!response.ok) {
				alertMsg(alertText, data.message)
			}

			localStorage.setItem('token', data.token)
			window.location.href = 'index.html'
			alertMsg(alertTextSuccess, 'Registration complete')
		} catch (error) {
			alertMsg(alertText, error.message)
		}
	}

	registerForm?.addEventListener('submit', register)

	// -------------------------------------------------- Login Logic --------------------------------------------

	const loginForm = document.getElementById('login-form')

	const login = async (e) => {
		e.preventDefault()

		const info = {
			email: loginForm.email.value,
			password: loginForm.password.value,
		}

		if (!info.email || !info.password) {
			alertMsg(alertText, 'Fields cannot be empty')
			return
		}

		try {
			const response = await fetch(`${url}/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(info),
			})
			if (!response.ok) {
				alertMsg(alertText, data.message)
			}

			const data = await response.json()
			localStorage.setItem('token', data.token)
			alertMsg(alertTextSuccess, 'Success')

			if (data.token) {
				window.location.href = 'index.html'
			}
		} catch (error) {
			console.log(error) //// ------------------------------------------- So it doesn't prevent the first error condition
		}
	}

	loginForm?.addEventListener('submit', login)
	// ------------------------------------------------- Get All Task --------------------------------------------------------------- //

	// Work on the network and unauthorized errors later

	let taskData = []

	const mongoData = async () => {
		try {
			const token = localStorage.getItem('token')

			const response = await fetch(`${url}/tasks`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				alertMsg(alertText, 'Failed to fetch Tasks')
				return
			}

			// -----------------------------------------------------------------------------------------
			const data = await response.json()

			taskData = data.tasks
			originalTaskData = [...taskData]

			// Total Number of Tasks

			document.getElementById('taskSize').textContent = data.tasks.length
			tasksDisplayed()
		} catch (error) {
			console.log(error)
		}
	}

	const tasksDisplayed = () => {
		taskList.innerHTML = ''
		if (taskData.length === 0) {
			taskList.innerHTML = `<h1 class="empty-task">No Tasks Here</h1>`
		} else {
			taskData.forEach((singleTask) => {
				const div = document.createElement('div')
				const { _id, title, description, deadline, priority } = singleTask
				const editDeadline = deadline.split('T')[0]

				div.innerHTML = `
        <div class="task-container">
          <div class="people-list">
            <p class="priority">${priority}</p>
            <p class="title"><span>Title: </span>${title}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>Deadline: </span>${editDeadline}</p>
            <p class="desc">${description}</p>
          </div>
          <div class="people-btn">
            <button class="edit-btn" data-id="${_id}"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="delete-btn" data-id="${_id}"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      `
				taskList.appendChild(div)
			})
		}

		// To Delete Item

		const deleteBtns = document.querySelectorAll('.delete-btn')
		deleteBtns.forEach((button) => {
			button.addEventListener('click', async (e) => {
				const taskId = e.target.closest('button').getAttribute('data-id')
				await handleDelete(taskId)
			})
		})

		// To edit Items
		const editBtn = document.querySelectorAll('.edit-btn')
		editBtn.forEach((btn) => {
			btn.addEventListener('click', async (e) => {
				const taskId = e.target.closest('button').getAttribute('data-id')
				await handleEdit(taskId)
			})
		})
	}

	const controlSearchInput = (e) => {
		e.preventDefault()
		const inputValue = e.target.value

		taskData = inputValue
			? originalTaskData.filter(
					(task) =>
						task.title.toLowerCase().includes(inputValue.toLowerCase()) ||
						task.description.toLowerCase().includes(inputValue.toLowerCase())
			  )
			: (taskData = [...originalTaskData])
		tasksDisplayed()
	}

	document
		.getElementById('searchInput')
		?.addEventListener('input', controlSearchInput)

	const lowPriority = () => {
		taskData = originalTaskData.filter((task) => task.priority === 'low')
		tasksDisplayed()
	}
	const mediumPriority = () => {
		taskData = originalTaskData.filter((task) => task.priority === 'medium')
		tasksDisplayed()
	}
	const highPriority = () => {
		taskData = originalTaskData.filter((task) => task.priority === 'high')
		tasksDisplayed()
	}

	document.getElementById('low')?.addEventListener('click', lowPriority)
	document.getElementById('medium')?.addEventListener('click', mediumPriority)
	document.getElementById('high')?.addEventListener('click', highPriority)

	// -------------------------------------------------- Edit Logic --------------------------------------------

	const handleEdit = async (id) => {
		const token = localStorage.getItem('token')

		const response = await fetch(`${url}/tasks/${id}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		})

		const editData = await response.json()
		editFrame(editData)

		if (!response.ok) {
			alertMsg(alertText, `No task with id ${id}`)
		}
	}

	const editFrame = (editData) => {
		editDiv.innerHTML = ''

		const {
			task: { _id, title, description, deadline, priority },
		} = editData

		const newDiv = document.createElement('div')
		const editDeadline = deadline.split('T')[0]

		newDiv.innerHTML = `
			<form class="task-form">
			<h3>${title} :</h3>
			<select id="edit-priority" name="priority" required>
					<option value="${priority}" selected>${priority}</option>
					<option value="low">Low</option>
					<option value="medium">Medium</option>
					<option value="high">High</option>
			</select>
			<input id="edit-title"  value=${title}>
			<textarea id="edit-desc" >${description}</textarea>
			<input id="edit-deadline" value="${editDeadline}" type="date" >
			<div class="edit-people-btn">
			<button id="cancel-edit-btn">Cancel</button>
			<button id="save-edit-btn" data-id="${_id}">Save Changes</button>
			</div>
			</form>
		`

		editDiv.appendChild(newDiv)

		const saveBtn = newDiv.querySelector('#save-edit-btn')
		if (saveBtn) {
			saveBtn.addEventListener('click', saveHandleEdit)
		}

		const cancelBtn = newDiv.querySelector('#cancel-edit-btn')
		if (cancelBtn) {
			cancelBtn.addEventListener('click', cancelHandleEdit)
		}
	}

	const editDiv = document.getElementById('edit-frame')

	const cancelHandleEdit = (e) => {
		e.preventDefault()
		editDiv.innerHTML = ''
	}

	// -------------------------------------------------- Save-Edit Logic --------------------------------------------

	const saveHandleEdit = async (e) => {
		e.preventDefault()

		const token = localStorage.getItem('token')
		const id = e.target.dataset.id

		const savePriority = document.getElementById('edit-priority')
		const saveTitle = document.getElementById('edit-title')
		const saveDesc = document.getElementById('edit-desc')
		const saveDeadline = document.getElementById('edit-deadline')

		const info = {
			title: saveTitle.value,
			description: saveDesc.value,
			priority: savePriority.value,
			deadline: saveDeadline.value,
		}

		const response = await fetch(`${url}/tasks/${id}`, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(info),
		})

		if (!response.ok) {
			alertMsg(alertText, 'Error saving data')
		}

		taskData = taskData.map((task) =>
			task._id === id ? { ...task, ...info } : task
		)
		alertMsg(alertTextSuccess, 'Changes Saved')

		editDiv.innerHTML = ''
		tasksDisplayed()
	}

	// -------------------------------------------------- Delete Logic --------------------------------------------

	const handleDelete = async (id) => {
		try {
			const token = localStorage.getItem('token')

			const response = await fetch(`${url}/tasks/${id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				alertMsg(alertText, `Failed to delete task with id ${id}`)
			}

			taskData = taskData.filter((task) => task._id !== id)
			alertMsg(alertTextSuccess, 'Item Deleted')
			tasksDisplayed()
		} catch (error) {
			alertMsg(alertText, error.message)
		}
	}

	// -------------------------------------------------- Create Logic --------------------------------------------
	const handleSubmit = async (e) => {
		e.preventDefault()
		const newTask = {
			title: form.title.value,
			description: form.description.value,
			deadline: form.deadline.value,
			priority: form.priority.value,
		}

		try {
			const token = localStorage.getItem('token')
			const response = await fetch(`${url}/tasks`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newTask),
			})
			if (!response.ok) {
				throw new Error('Error: Something went wrong')
			}
			taskData.push(newTask)
			form.reset()
			alertMsg(alertTextSuccess, 'Task Added')
			tasksDisplayed()
		} catch (error) {
			alertMsg(alertText, error.message)
		}
	}

	const signOut = document.querySelector('.sign-out')

	const handleSignOut = () => {
		localStorage.removeItem('token')
		window.location.href = 'login.html'
	}

	signOut?.addEventListener('click', handleSignOut)
	form?.addEventListener('submit', handleSubmit)
	mongoData()
})
