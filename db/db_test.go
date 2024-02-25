package db

import (
	"context"
	"fmt"
	"testing"

	"github.com/deanrtaylor1/simplebase/internal"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type MockConnector struct {
	mock.Mock
}

func (m *MockConnector) Connect(ctx context.Context, connString string) (DBQuerier, error) {
	args := m.Called(ctx, connString)
	return args.Get(0).(DBQuerier), args.Error(1)
}

type MockQuerier struct {
	mock.Mock
}

func (m *MockQuerier) QueryRow(ctx context.Context, sql string, args ...interface{}) DBScanner {
	m.Called(ctx, sql, args)
	return &MockScanner{}
}

func (m *MockQuerier) Close(ctx context.Context) error {
	args := m.Called(ctx)
	return args.Error(0)
}

type MockScanner struct {
	mock.Mock
}

func (m *MockScanner) Scan(dest ...interface{}) error {
	args := m.Called(dest)
	return args.Error(0)
}

func TestTestConnection(t *testing.T) {
	ctx := context.Background()

	t.Run("ValidConnectionString", func(t *testing.T) {
		mockConnector := new(MockConnector)
		mockQuerier := new(MockQuerier)

		mockConnector.On("Connect", ctx, "valid_conn_string").Return(mockQuerier, nil)

		result, _ := TestConnection(ctx, "valid_conn_string", mockConnector)

		assert.True(t, result, "Expected true for valid connection string")

		mockConnector.AssertExpectations(t)
		mockQuerier.AssertExpectations(t)
	})

	t.Run("InvalidConnectionString", func(t *testing.T) {
		mockConnector := new(MockConnector)

		mockConnector.On("Connect", ctx, "invalid_conn_string").Return(&PgxConnWrapper{}, fmt.Errorf("failed to connect"))

		result, _ := TestConnection(ctx, "invalid_conn_string", mockConnector)

		assert.False(t, result, "Expected false for invalid connection string")

		mockConnector.AssertExpectations(t)
	})

}

type MockDBQuerier struct {
	mock.Mock
}

func (m *MockDBQuerier) QueryRow(ctx context.Context, sql string, args ...interface{}) DBScanner {
	args = m.Called(ctx, sql, args).Get(0).([]interface{})
	return args[0].(DBScanner)
}

func (m *MockDBQuerier) Close(ctx context.Context) error {
	return m.Called(ctx).Error(0)
}

type MockDBScanner struct {
	mock.Mock
}

func (m *MockDBScanner) Scan(dest ...interface{}) error {
	return m.Called(dest).Error(0)
}

func TestRunTestQuery(t *testing.T) {
	ctx := context.Background()
	mockQuerier := new(MockDBQuerier)
	mockScanner := new(MockDBScanner)

	// Set up the mock behavior
	mockQuerier.On("QueryRow", ctx, internal.Testquery, mock.Anything).Return([]interface{}{mockScanner})
	mockScanner.On("Scan", mock.Anything).Return(nil)
	mockQuerier.On("Close", ctx).Return(nil)

	// Call the function under test
	result := RunTestQuery(ctx, mockQuerier)

	// Assert and verify expectations
	assert.True(t, result, "RunTestQuery should return true when the query executes successfully")
	mockQuerier.AssertExpectations(t)
	mockScanner.AssertExpectations(t)
}
