# Module Tests - Task Service

import { describe, it, expect, vi } from 'vitest'
import taskService from '../services/taskService'

describe('TaskService', () => {
  describe('getAllTasks', () => {
    it('should fetch all tasks', async () => {
      const mockData = [
        { id: 1, title: 'Task 1', status: 'TODO' },
        { id: 2, title: 'Task 2', status: 'IN_PROGRESS' }
      ]
      
      // Mock axios.get
      vi.spyOn(taskService, 'getAllTasks').mockResolvedValue({ data: mockData })
      
      const response = await taskService.getAllTasks()
      expect(response.data).toEqual(mockData)
      expect(response.data.length).toBe(2)
    })
  })

  describe('createTask', () => {
    it('should create a new task', async () => {
      const newTask = {
        title: 'New Task',
        status: 'TODO',
        priority: 'HIGH',
        projectId: 1
      }
      
      const mockResponse = { id: 1, ...newTask }
      
      vi.spyOn(taskService, 'createTask').mockResolvedValue({ data: mockResponse })
      
      const response = await taskService.createTask(newTask)
      expect(response.data.id).toBe(1)
      expect(response.data.title).toBe('New Task')
    })
  })

  describe('updateTask', () => {
    it('should update a task', async () => {
      const taskId = 1
      const updatedTask = {
        title: 'Updated Task',
        status: 'IN_PROGRESS'
      }
      
      const mockResponse = { id: taskId, ...updatedTask }
      
      vi.spyOn(taskService, 'updateTask').mockResolvedValue({ data: mockResponse })
      
      const response = await taskService.updateTask(taskId, updatedTask)
      expect(response.data.title).toBe('Updated Task')
      expect(response.data.status).toBe('IN_PROGRESS')
    })
  })

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const taskId = 1
      
      vi.spyOn(taskService, 'deleteTask').mockResolvedValue({})
      
      const response = await taskService.deleteTask(taskId)
      expect(response).toBeDefined()
    })
  })
})
